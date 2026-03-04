import OrdenModel from "./orden.model.js";
import type {
  ItemOrden,
  EstadoOrden,
  Orden,
  Cliente,
  TipoEntrega,
  Promocion,
} from "../../types.js";
import MotorPromociones from "../promociones/MotorPromociones.js";
import ProductoModel from "../productos/productos.model.js";
import PromocionModel from "../promociones/promocion.model.js";

type OrdenCreateBody = {
  items: Pick<ItemOrden, "productoId" | "cantidad" | "extras">[];
  cliente: Cliente;
  tipoEntrega: TipoEntrega;
};

export default class OrdenService {
  async getOrdenes(): Promise<Orden[]> {
    try {
      const ordenes = await OrdenModel.find().lean();
      return ordenes.map((orden) => ({
        id: orden._id.toString(),
        items: orden.items,
        cliente: orden.cliente,
        tipoEntrega: orden.tipoEntrega,
        estado: orden.estado,
        subtotal: orden.subtotal,
        descuentoTotal: orden.descuentoTotal,
        total: orden.total,
        promocionesAplicadas: orden.promocionesAplicadas,
      }));
    } catch (error) {
      console.error("Error al obtener ordenes:", error);
      throw new Error("No se pudieron obtener las ordenes");
    }
  }
  async getOrdenById(id: string): Promise<Orden | null> {
    try {
      const orden = await OrdenModel.findById(id).lean();
      if (!orden) return null;
      return {
        id: orden._id.toString(),
        items: orden.items,
        cliente: orden.cliente,
        tipoEntrega: orden.tipoEntrega,
        estado: orden.estado,
        subtotal: orden.subtotal,
        descuentoTotal: orden.descuentoTotal,
        total: orden.total,
        promocionesAplicadas: orden.promocionesAplicadas,
      };
    } catch (error) {
      console.error("Error al obtener la orden:", error);
      throw new Error("No se pudo obtener la orden");
    }
  }

  async createOrden(data: OrdenCreateBody): Promise<Orden> {
    try {
      // 1. Buscar productos y extras en paralelo (nunca confiar en precios del cliente)
      const productosIds = data.items.map((i) => i.productoId);
      const extrasUnicosIds = [
        ...new Set(
          data.items.flatMap((i) => (i.extras ?? []).map((e) => e.extraId)),
        ),
      ];
      const [productosEncontrados, todosExtrasEncontrados] = await Promise.all([
        ProductoModel.find({ _id: { $in: productosIds } }).lean(),
        extrasUnicosIds.length
          ? ProductoModel.find({
              _id: { $in: extrasUnicosIds },
              categoria: "extra",
              activo: true,
            }).lean()
          : Promise.resolve([]),
      ]);

      // 2. Validar que todos los productos existen y están activos
      for (const item of data.items) {
        const producto = productosEncontrados.find(
          (p) => p._id.toString() === item.productoId,
        );
        if (!producto) {
          throw new Error(`Producto ${item.productoId} no encontrado`);
        }
        if (!producto.activo) {
          throw new Error(`Producto ${producto.nombre} no está disponible`);
        }

        // 3. Validar extras si es hamburguesa
        if (producto.categoria === "hamburguesa" && item.extras?.length) {
          const idsExtrasItem = [...new Set(item.extras.map((e) => e.extraId))];

          const extrasValidos = idsExtrasItem.filter((eid) =>
            todosExtrasEncontrados.some((ex) => ex._id.toString() === eid),
          );
          if (extrasValidos.length !== idsExtrasItem.length) {
            throw new Error(
              `Uno o más extras de la hamburguesa ${producto.nombre} no son válidos`,
            );
          }

          // Verificar que ningún extra esté en la lista de bloqueados
          const excluidos = producto.extrasExcluidos ?? [];
          const extraBloqueado = idsExtrasItem.find((eid) =>
            excluidos.includes(eid),
          );
          if (extraBloqueado) {
            throw new Error(
              `El extra ${extraBloqueado} no está disponible para la hamburguesa ${producto.nombre}`,
            );
          }
        }
      }

      // 4. Construir items con el precio real (base + suma de extras × su cantidad)
      const itemsConPrecio: ItemOrden[] = data.items.map((item) => {
        const producto = productosEncontrados.find(
          (p) => p._id.toString() === item.productoId,
        )!;
        const precioExtras = (item.extras ?? []).reduce((acc, e) => {
          const extra = todosExtrasEncontrados.find(
            (ex) => ex._id.toString() === e.extraId,
          );
          return acc + (extra?.precio ?? 0) * e.cantidad;
        }, 0);
        return {
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: producto.precio + precioExtras,
          ...(item.extras?.length && { extras: item.extras }),
        };
      });

      // 5. Buscar promociones activas
      const ahora = new Date();
      const promocionesActivas = await PromocionModel.find({
        activa: true,
        fechaInicio: { $lte: ahora },
        fechaFin: { $gte: ahora },
      }).lean();

      // 6. Mapear catalogo y promociones a los types (ObjectId → string)
      const catalogo = productosEncontrados.map((p) => ({
        id: p._id.toString(),
        nombre: p.nombre,
        precio: p.precio,
        categoria: p.categoria,
        activo: p.activo,
        ...(p.descripcion !== undefined && { descripcion: p.descripcion }),
        ...(p.imagenUrl !== undefined && { imagenUrl: p.imagenUrl }),
        ...(p.extrasExcluidos?.length && {
          extrasExcluidos: p.extrasExcluidos,
        }),
      }));

      const promociones = promocionesActivas.map((p) => ({
        id: p._id.toString(),
        nombre: p.nombre,
        tipo: p.tipo,
        valor: p.valor,
        alcance: p.alcance,
        activa: p.activa,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
        ...(p.categoriasAplicables?.length && {
          categoriasAplicables: p.categoriasAplicables,
        }),
        ...(p.productosAplicables?.length && {
          productosAplicables: p.productosAplicables,
        }),
      }));

      // 7. Aplicar motor de promociones
      const ordenCalculada = MotorPromociones.aplicarPromociones(
        {
          id: "",
          items: itemsConPrecio,
          estado: "pendiente",
          cliente: data.cliente,
          tipoEntrega: data.tipoEntrega,
        },
        promociones as Promocion[],
        catalogo,
      );

      // 8. Guardar la orden final en la base
      const ordenGuardada = await OrdenModel.create({
        cliente: data.cliente,
        tipoEntrega: data.tipoEntrega,
        items: ordenCalculada.items,
        estado: "pendiente",
        subtotal: ordenCalculada.subtotal,
        descuentoTotal: ordenCalculada.descuentoTotal,
        total: ordenCalculada.total,
        promocionesAplicadas: ordenCalculada.promocionesAplicadas,
      });

      return {
        id: ordenGuardada._id.toString(),
        items: ordenGuardada.items,
        cliente: ordenGuardada.cliente,
        tipoEntrega: ordenGuardada.tipoEntrega,
        estado: ordenGuardada.estado,
        subtotal: ordenGuardada.subtotal,
        descuentoTotal: ordenGuardada.descuentoTotal,
        total: ordenGuardada.total,
        promocionesAplicadas: ordenGuardada.promocionesAplicadas,
      };
    } catch (error) {
      console.error("Error al crear la orden:", error);
      throw error; // re-throw para que el controller pueda manejar el mensaje
    }
  }
  async updateEstado(id: string, estado: EstadoOrden): Promise<Orden | null> {
    try {
      const orden = await OrdenModel.findByIdAndUpdate(
        id,
        { estado },
        { new: true },
      ).lean();
      if (!orden) return null;
      return {
        id: orden._id.toString(),
        items: orden.items,
        cliente: orden.cliente,
        tipoEntrega: orden.tipoEntrega,
        estado: orden.estado,
        subtotal: orden.subtotal,
        descuentoTotal: orden.descuentoTotal,
        total: orden.total,
        promocionesAplicadas: orden.promocionesAplicadas,
      };
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      throw new Error("No se pudo actualizar el estado de la orden");
    }
  }
}
