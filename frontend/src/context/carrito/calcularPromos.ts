import type { Promocion, PromocionAplicada } from "../../types/promocion.types";
import type { ItemOrden } from "./orden.type";
import type { Producto } from "../../types/product.type";

// ─── elegibilidad ─────────────────────────────────────────────────────────────

function itemsElegibles(
  items: ItemOrden[],
  promo: Promocion,
  catalogo: Producto[],
): ItemOrden[] {
  if (promo.alcance === "todos") return items;

  return items.filter((item) => {
    const prod = catalogo.find((p) => p._id === item.productoId);
    if (!prod) return false;
    if (promo.alcance === "categoria") {
      return promo.categoriasAplicables?.includes(prod.categoria) ?? false;
    }
    if (promo.alcance === "productos") {
      return promo.productosAplicables?.includes(item.productoId) ?? false;
    }
    return false;
  });
}

// ─── cálculo por tipo ─────────────────────────────────────────────────────────

function calcularDescuento(
  items: ItemOrden[],
  promo: Promocion,
  catalogo: Producto[],
): PromocionAplicada | null {
  const elegibles = itemsElegibles(items, promo, catalogo);
  if (elegibles.length === 0) return null;

  const afectados = elegibles.map((i) => i.productoId);
  let montoDescontado = 0;

  switch (promo.tipo) {
    case "porcentaje": {
      const base = elegibles.reduce(
        (acc, i) => acc + i.precioUnitario * i.cantidad,
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
      // Por cada 2 unidades elegibles, la de MENOR precio es gratis.
      // Con n unidades, hay floor(n/2) gratis: siempre las más baratas.
      const unidades: number[] = [];
      for (const item of elegibles) {
        for (let i = 0; i < item.cantidad; i++) {
          unidades.push(item.precioUnitario);
        }
      }
      unidades.sort((a, b) => a - b); // ASC: más baratas primero
      const libres2x1 = Math.floor(unidades.length / 2);
      for (let i = 0; i < libres2x1; i++) {
        montoDescontado += unidades[i]; // las libres2x1 más baratas son gratis
      }
      break;
    }

    case "3x2": {
      // Por cada 3 unidades elegibles, la de MENOR precio es gratis.
      // Con n unidades, hay floor(n/3) gratis: siempre las más baratas.
      const unidades: number[] = [];
      for (const item of elegibles) {
        for (let i = 0; i < item.cantidad; i++) {
          unidades.push(item.precioUnitario);
        }
      }
      unidades.sort((a, b) => a - b); // ASC: más baratas primero
      const libres3x2 = Math.floor(unidades.length / 3);
      for (let i = 0; i < libres3x2; i++) {
        montoDescontado += unidades[i]; // las libres3x2 más baratas son gratis
      }
      break;
    }

    case "combo": {
      if (promo.alcance !== "productos" || !promo.productosAplicables)
        return null;
      const todosPresentes = promo.productosAplicables.every((pid) =>
        items.some((i) => i.productoId === pid),
      );
      if (!todosPresentes) return null;
      const subtotalCombo = elegibles.reduce(
        (acc, i) => acc + i.precioUnitario,
        0,
      );
      montoDescontado = Math.max(0, subtotalCombo - promo.valor);
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

// ─── función principal ────────────────────────────────────────────────────────

export interface ResumenCarrito {
  subtotal: number;
  promocionesAplicadas: PromocionAplicada[];
  descuentoTotal: number;
  total: number;
}

export function calcularResumenCarrito(
  items: ItemOrden[],
  promociones: Promocion[],
  catalogo: Producto[],
): ResumenCarrito {
  const subtotal = items.reduce(
    (acc, i) => acc + i.precioUnitario * i.cantidad,
    0,
  );

  if (items.length === 0) {
    return {
      subtotal: 0,
      promocionesAplicadas: [],
      descuentoTotal: 0,
      total: 0,
    };
  }

  const ahora = new Date();
  const activas = promociones.filter(
    (p) =>
      p.activa &&
      new Date(p.fechaInicio) <= ahora &&
      new Date(p.fechaFin) >= ahora,
  );

  const promocionesAplicadas: PromocionAplicada[] = [];
  let descuentoTotal = 0;

  for (const promo of activas) {
    const resultado = calcularDescuento(items, promo, catalogo);
    if (resultado) {
      promocionesAplicadas.push(resultado);
      descuentoTotal += resultado.montoDescontado;
    }
  }

  descuentoTotal = Math.round(descuentoTotal * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    promocionesAplicadas,
    descuentoTotal,
    total: Math.max(0, Math.round((subtotal - descuentoTotal) * 100) / 100),
  };
}
