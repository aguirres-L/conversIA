import { useEffect } from "react";

const VARIANTS = {
  success: {
    icon: (
      <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Listo",
    containerClass: "bg-white border border-green-200",
    titleClass: "text-green-800",
    messageClass: "text-neutral-600",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  error: {
    icon: (
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Error",
    containerClass: "bg-white border border-red-200",
    titleClass: "text-red-800",
    messageClass: "text-neutral-600",
    buttonClass: "bg-red-600 hover:bg-red-700 text-white",
  },
};

/**
 * Modal reutilizable para éxito o error.
 * @param {boolean} open - Si el modal está visible
 * @param {() => void} onClose - Callback al cerrar (botón o backdrop)
 * @param {"success" | "error"} variant - Tipo visual
 * @param {string} [title] - Título (opcional; por defecto "Listo" / "Error")
 * @param {string} message - Mensaje principal (ej. "Guardado correctamente")
 * @param {string} [buttonText] - Texto del botón (por defecto "Entendido")
 */
export default function ModalComponentConversIA({
  open,
  onClose,
  variant = "success",
  title,
  message,
  buttonText = "Entendido",
}) {
  const config = VARIANTS[variant] ?? VARIANTS.success;

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity"
        aria-label="Cerrar"
      />
      <div
        className={`relative w-full max-w-sm rounded-xl shadow-xl p-6 ${config.containerClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="shrink-0">{config.icon}</div>
          <div className="space-y-1">
            <h2 id="modal-title" className={`text-lg font-semibold ${config.titleClass}`}>
              {title ?? config.title}
            </h2>
            <p id="modal-desc" className={`text-sm ${config.messageClass}`}>
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition ${config.buttonClass}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
