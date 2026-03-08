import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { listProducts, createProduct, setProductActive } from "../services/firebase/all_collections/products/productsService";

export default function ProductsPage() {
  const { business } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargarProductos = useCallback(async () => {
    if (!business?.id) return;
    setLoading(true);
    setError(null);
    try {
      // activeOnly: false evita índice compuesto (isActive + updatedAt); filtramos en cliente
      const lista = await listProducts(business.id, { activeOnly: false, max: 100 });
      setItems(lista.filter((p) => p.isActive !== false));
    } catch (err) {
      setError(err?.message ?? "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const noHayDatos = items.length === 0;

  const handleAgregar = async (e) => {
    e.preventDefault();
    const name = nombre.trim();
    if (!name || !business?.id) return;
    setGuardando(true);
    try {
      const productId = sku.trim() || `prod_${Date.now()}`;
      const price = precio.trim() ? Number(precio.replace(",", ".")) : 0;
      await createProduct(business.id, productId, {
        type: "product",
        name,
        description: "",
        price,
        tags: [],
        metadata: sku.trim() ? { sku: sku.trim() } : {},
      });
      setNombre("");
      setSku("");
      setPrecio("");
      setMostrarForm(false);
      await cargarProductos();
    } catch (err) {
      setError(err?.message ?? "Error al guardar el producto");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (item) => {
    if (!business?.id || !item?.id) return;
    try {
      await setProductActive(business.id, item.id, false);
      await cargarProductos();
    } catch (err) {
      setError(err?.message ?? "Error al eliminar");
    }
  };

  if (!business) {
    return (
      <div className="p-4 text-center text-neutral-500">
        Cargando negocio…
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">
          Servicios / Productos del Cliente
        </h2>
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

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando productos…</p>
      ) : null}

      {noHayDatos && !mostrarForm && !loading && (
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
                disabled={guardando}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {guardando ? "Guardando…" : "Guardar"}
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

      {!loading && items.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">
            Listado cargado
          </h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-xl bg-white flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-500">SKU: {item.metadata?.sku ?? item.id}</p>
                  {item.price != null && item.price !== 0 && (
                    <p className="text-sm font-semibold">${item.price}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleEliminar(item)}
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
