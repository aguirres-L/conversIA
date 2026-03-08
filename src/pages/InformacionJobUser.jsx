import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  getBusiness,
  updateBusinessInfo,
  BUSINESS_INFO_FIELDS,
} from "../services/firebase/all_collections/businesses";
import ModalComponentConversIA from "../hooks/modal/ModalComponentConversIA.jsx";

const ADDRESS_TYPES = [
  { value: "physical", label: "Negocio con ubicación física" },
  { value: "virtual", label: "Solo ventas online / virtual" },
];

const emptyInfo = {
  [BUSINESS_INFO_FIELDS.addressType]: "physical",
  [BUSINESS_INFO_FIELDS.address]: "",
  [BUSINESS_INFO_FIELDS.businessHours]: "",
  [BUSINESS_INFO_FIELDS.description]: "",
  [BUSINESS_INFO_FIELDS.paymentMethods]: "",
  [BUSINESS_INFO_FIELDS.deliveryZone]: "",
  [BUSINESS_INFO_FIELDS.email]: "",
  [BUSINESS_INFO_FIELDS.website]: "",
  [BUSINESS_INFO_FIELDS.extraContext]: "",
};

function getInitialForm(businessInfo) {
  if (!businessInfo || typeof businessInfo !== "object") return { ...emptyInfo };
  return { ...emptyInfo, ...businessInfo };
}

export default function InformacionJobUser() {
  const { business } = useAuthStore();
  const [form, setForm] = useState(emptyInfo);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [guardadoOk, setGuardadoOk] = useState(false);

  useEffect(() => {
    if (!business?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBusiness(business.id)
      .then((doc) => {
        if (cancelled) return;
        setForm(getInitialForm(doc?.businessInfo));
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Error al cargar la información");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [business?.id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));
    setGuardadoOk(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!business?.id) return;
    setError(null);
    setGuardando(true);
    setGuardadoOk(false);
    try {
      await updateBusinessInfo(business.id, form);
      setGuardadoOk(true);
    } catch (err) {
      setError(err?.message ?? "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  if (!business) {
    return (
      <div className="p-4 text-center text-neutral-500">
        Cargando negocio…
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-neutral-500">
        Cargando información del negocio…
      </div>
    );
  }

  return (
    <div className="p-4 pb-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Información de tu negocio</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Completá estos datos para que el bot pueda responder con horarios, dirección, formas de pago y más.
        </p>
      </div>

      <ModalComponentConversIA
        open={guardadoOk}
        onClose={() => setGuardadoOk(false)}
        variant="success"
        message="Guardado correctamente."
      />
      <ModalComponentConversIA
        open={!!error}
        onClose={() => setError(null)}
        variant="error"
        message={error ?? ""}
        buttonText="Cerrar"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo de ubicación */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Tipo de negocio
          </label>
          <select
            value={form[BUSINESS_INFO_FIELDS.addressType] || "physical"}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.addressType, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          >
            {ADDRESS_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </section>

        {/* Dirección o aclaración */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {form[BUSINESS_INFO_FIELDS.addressType] === "virtual"
              ? "Aclaración (ej. Solo ventas online)"
              : "Dirección o ubicación"}
          </label>
          <input
            type="text"
            value={form[BUSINESS_INFO_FIELDS.address] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.address, e.target.value)}
            placeholder={
              form[BUSINESS_INFO_FIELDS.addressType] === "virtual"
                ? "Ej: Solo ventas por WhatsApp / envíos a todo el país"
                : "Ej: Av. Ejemplo 123, local 5"
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Horarios de atención */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Horarios de atención
          </label>
          <input
            type="text"
            value={form[BUSINESS_INFO_FIELDS.businessHours] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.businessHours, e.target.value)}
            placeholder="Ej: Lun a Vie 9-18, Sáb 9-13"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Descripción del negocio */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Descripción del negocio (para el bot)
          </label>
          <textarea
            value={form[BUSINESS_INFO_FIELDS.description] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.description, e.target.value)}
            placeholder="Qué vendés o qué servicios ofrecés. El bot usará esto para dar mejor contexto."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500 resize-y"
          />
        </section>

        {/* Formas de pago */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Formas de pago
          </label>
          <input
            type="text"
            value={form[BUSINESS_INFO_FIELDS.paymentMethods] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.paymentMethods, e.target.value)}
            placeholder="Ej: Efectivo, transferencia, tarjeta, Mercado Pago"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Zona de envío */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Zona de envío o cobertura
          </label>
          <input
            type="text"
            value={form[BUSINESS_INFO_FIELDS.deliveryZone] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.deliveryZone, e.target.value)}
            placeholder="Ej: Córdoba capital y alrededores / Todo el país"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Email */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email de contacto
          </label>
          <input
            type="email"
            value={form[BUSINESS_INFO_FIELDS.email] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.email, e.target.value)}
            placeholder="contacto@tunegocio.com"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Web */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Sitio web
          </label>
          <input
            type="url"
            value={form[BUSINESS_INFO_FIELDS.website] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.website, e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500"
          />
        </section>

        {/* Contexto extra para la IA */}
        <section>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Información adicional (para el bot)
          </label>
          <textarea
            value={form[BUSINESS_INFO_FIELDS.extraContext] ?? ""}
            onChange={(e) => handleChange(BUSINESS_INFO_FIELDS.extraContext, e.target.value)}
            placeholder="Cualquier dato que quieras que el bot conozca: promos fijas, condiciones especiales, etc."
            rows={2}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-neutral-500 resize-y"
          />
        </section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="w-full py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition"
          >
            {guardando ? "Guardando…" : "Guardar información"}
          </button>
        </div>
      </form>
    </div>
  );
}
