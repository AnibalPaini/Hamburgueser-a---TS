import type {
  Promocion,
  Producto,
  Orden,
  PromocionAplicada,
  ItemOrden,
} from "../../types.js";

export default class MotorPromociones {
  static aplicarPromociones(
    orden: Omit<
      Orden,
      "promocionesAplicadas" | "subtotal" | "descuentoTotal" | "total"
    >,
    promociones: Promocion[],
    catalogo: Producto[],
  ): Orden {
    const ahora = new Date();

    //Calcular subtotal sin descuentos
    const subtotal = orden.items.reduce(
      (acc, item) => acc + item.precioUnitario * item.cantidad,
      0,
    );

    //Filtrar promociones activas
    const promocionesActivas = promociones.filter(
      (promo) =>
        promo.activa && ahora >= promo.fechaInicio && ahora <= promo.fechaFin,
    );

    const promosAplicadas: PromocionAplicada[] = [];
    let descuentoTotal = 0;

    for (const promo of promocionesActivas) {
      const resultado = this.calcularPromocion(orden.items, promo, catalogo);
      if (resultado && resultado.montoDescontado > 0) {
        promosAplicadas.push({
          promocionId: promo.id.toString(),
          nombre: promo.nombre,
          tipo: promo.tipo,
          montoDescontado: resultado.montoDescontado,
          itemsAfectados: resultado.itemsAfectados,
        });
        descuentoTotal += resultado.montoDescontado;
      }
    }

    return {
      ...orden,
      promocionesAplicadas: promosAplicadas,
      subtotal,
      descuentoTotal,
      total: Math.max(0, subtotal - descuentoTotal),
    };
  }

  //Helpers

  private static calcularPromocion(
    items: ItemOrden[],
    promo: Promocion,
    catalogo: Producto[],
  ): PromocionAplicada | null {
    // Aquí va la lógica específica para cada tipo de promoción.
    // Por ejemplo, para "descuento_porcentaje", "descuento_fijo", "2x1", etc.
    // Se debe verificar el alcance (general, categoria, productos, combo) y aplicar la promoción según corresponda.
    const itemsElegibles = items.filter((item) =>
      this.esElegible(item, promo, catalogo),
    );
    if (itemsElegibles.length === 0) return null;

    let montoDescontado = 0;
    const afectados = itemsElegibles.map((i) => i.productoId);

    switch (promo.tipo) {
      case "porcentaje": {
        const base = itemsElegibles.reduce(
          (acc, item) => acc + item.precioUnitario * item.cantidad,
          0,
        );
        montoDescontado = (base * promo.valor) / 100;
        break;
      }
      case "monto_fijo": {
        montoDescontado = promo.valor;
        break;
      }
      case "2x1": {
        // Lógica para 2x1
        /**
         * Por cada par de unidades elegibles, la de menor precio es gratis.
         * Funciona con múltiples productos distintos o el mismo repetido.
         */
        const unidades: number[] = [];
        for (const item of itemsElegibles) {
          for (let i = 0; i < item.cantidad; i++) {
            unidades.push(item.precioUnitario);
          }
        }
        unidades.sort((a, b) => b - a); // ordenar de mayor a menor
        for (let i = 1; i < unidades.length; i += 2) {
          montoDescontado += unidades[i] ?? 0; // el de menor precio en cada par
        }
        break;
      }
      case "combo": {
        // Lógica para combo
        /**
         * Si todos los productos del combo están en la orden,
         * la diferencia entre el subtotal de esos items y el precio del combo
         * es el descuento.
         */
        if (promo.alcance !== "productos" || !promo.productosAplicables) {
          return null;
        }
        const todosPresentes = promo.productosAplicables.every((pid) =>
          items.some((i) => i.productoId === pid),
        );

        if (!todosPresentes) return null;

        const subtotalCombo = itemsElegibles.reduce(
          (acc, i) => acc + i.precioUnitario,
          0,
        );

        montoDescontado = Math.max(0, subtotalCombo - promo.valor);
        break;
      }
      case "3x2": {
        // Lógica para 3x2
        /**
         * Por cada trio de unidades elegibles, la de menor precio es gratis.
         * Funciona con múltiples productos distintos o el mismo repetido.
         */
        const unidades_3x2: number[] = [];
        for (const item of itemsElegibles) {
          for (let i = 0; i < item.cantidad; i++) {
            unidades_3x2.push(item.precioUnitario);
          }
        }
        unidades_3x2.sort((a, b) => b - a); // ordenar de mayor a menor

        for (let i = 2; i < unidades_3x2.length; i += 3) {
          montoDescontado += unidades_3x2[i] ?? 0; // el de menor precio en cada trio
        }
        break;
      }
      default:
        return null;
    }
    if (montoDescontado <= 0) return null;

    return {
      promocionId: promo.id,
      nombre: promo.nombre,
      tipo: promo.tipo,
      montoDescontado: Math.round(montoDescontado * 100) / 100,
      itemsAfectados: afectados,
    };
  }
  /** Determina si un item de la orden es elegible para una promoción */
  private static esElegible(
    item: ItemOrden,
    promo: Promocion,
    catalogo: Producto[],
  ): boolean {
    if (promo.alcance === "todos") return true;

    const producto = catalogo.find((p) => p.id === item.productoId);
    if (!producto) return false;

    if (promo.alcance === "categoria") {
      return promo.categoriasAplicables?.includes(producto.categoria) ?? false;
    }

    if (promo.alcance === "productos") {
      return promo.productosAplicables?.includes(item.productoId) ?? false;
    }

    return false;
  }
}
