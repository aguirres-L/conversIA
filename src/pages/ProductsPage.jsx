import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

const LEYENDA =
  "En este apartado se cargan productos, servicios o datos del negocio para que el bot tenga mejor contexto al responder los chats con los clientes.";

export default function ProductsPage() {
  const { products, addProductItem, removeProductItem } = useAppStore();
  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const items = products.items ?? [];
  const noHayDatos = items.length === 0;

  const handleAgregar = (e) => {
    e.preventDefault();
    const name = nombre.trim();
    if (!name) return;
    addProductItem({
      sku: sku.trim() || undefined,
      name,
      price: precio.trim() ? Number(precio.replace(",", ".")) : 0,
    });
    setNombre("");
    setSku("");
    setPrecio("");
    setMostrarForm(false);
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">
          Servicios / Productos del Cliente
        </h2>
       {/*  <p className="text-sm text-neutral-600 mt-1">{LEYENDA}</p> */}
       <div className="flex items-center justify-between gap-2">
        
        {!mostrarForm ? (
          <button
            type="button"
            onClick={() => setMostrarForm(true)}
            className="text-sm px-3 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
          >
            Agregar
          </button>
        ) : null}
      </div>
      </div>

      {noHayDatos && !mostrarForm && (
        <div className="p-5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-center">
          <p className="text-sm text-neutral-600">
            Cuando no tengas ningún producto, servicio ni dato cargado, recuerda
            que aquí se cargan para que el bot tenga mejor contexto al responder
            los chats con los clientes.
          </p>
        </div>
      )}

      <section className="space-y-3">
      

        {mostrarForm && (
          <form
            onSubmit={handleAgregar}
            className="p-4 rounded-xl border bg-white space-y-3"
          >
            <div>
              <label htmlFor="producto-nombre" className="block text-xs font-medium text-neutral-600 mb-1">
                Nombre *
              </label>
              <input
                id="producto-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Plan básico, Servicio X, Política de devoluciones"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="producto-sku" className="block text-xs font-medium text-neutral-600 mb-1">
                  Código / SKU
                </label>
                <input
                  id="producto-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ej. A1, PLAN-01"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="producto-precio" className="block text-xs font-medium text-neutral-600 mb-1">
                  Precio (opcional)
                </label>
                <input
                  id="producto-precio"
                  type="text"
                  inputMode="decimal"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej. 20 o 19.99"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarForm(false);
                  setNombre("");
                  setSku("");
                  setPrecio("");
                }}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-neutral-50 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>

      {items.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">
            Listado cargado
          </h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.sku}
                className="p-4 border rounded-xl bg-white flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-500">SKU: {item.sku}</p>
                  {item.price != null && item.price !== 0 && (
                    <p className="text-sm font-semibold">${item.price}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeProductItem(item.sku)}
                  className="text-neutral-400 hover:text-red-600 text-sm shrink-0"
                  aria-label="Eliminar"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
