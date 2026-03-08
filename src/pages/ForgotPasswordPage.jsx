import { useState } from "react";
import { Link } from "react-router-dom";

import logoConversIA from "../../public/conversIA-logo.PNG";
import HeroComponent from "../components/hero/HeroComponent.jsx";

const ROUTES = {
  login: "/login",
};

// Mismas clases que Login para consistencia visual
const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm " +
  "placeholder:text-white/40 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10";
const LABEL_CLASS = "text-sm text-white/80";
const LINK_SECONDARY_CLASS =
  "text-xs text-white/70 hover:text-white underline underline-offset-4";

function useForgotPasswordForm() {
  const [isEnviado, setIsEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: conectar con API de recuperación (enviar email)
    setIsEnviado(true);
  };

  return { isEnviado, handleSubmit };
}

export default function ForgotPasswordPage() {
  const { isEnviado, handleSubmit } = useForgotPasswordForm();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-dvh bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroComponent />
      </div>
      <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-sm shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <header className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-widest text-white/60">
                  CONVERSIA
                </p>
                <h1 className="text-xl font-semibold mt-1">
                  Recuperar contraseña
                </h1>
              </div>
              <img
                src={logoConversIA}
                alt="ConversIA Logo"
                className="h-24 w-24 rounded-xl object-cover"
              />
            </div>
            <p className="text-sm text-white/70 mt-3">
              Ingresá tu email y te enviamos un enlace para restablecer tu
              contraseña.
            </p>
          </header>

          {/* Formulario o mensaje de éxito */}
          {isEnviado ? (
            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                Revisá tu bandeja de entrada. Si no ves el correo, revisá la
                carpeta de spam.
              </div>
              <Link
                to={ROUTES.login}
                className="block w-full rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 active:bg-white/80 transition text-center"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className={LABEL_CLASS} htmlFor="forgot-email">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className={INPUT_CLASS}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 active:bg-white/80 transition"
              >
                Enviar enlace
              </button>

              <p className="text-xs text-white/60 text-center pt-1">
                <Link to={ROUTES.login} className={LINK_SECONDARY_CLASS}>
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
          </div>

          <p className="text-center text-[11px] text-white/40 mt-4">
            · © {currentYear} ConversIA ·
          </p>
        </div>
      </div>
    </div>
  );
}
