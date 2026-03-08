import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

import logoConversIA from "../../public/conversIA-logo.PNG";
import HeroComponent from "../components/hero/HeroComponent.jsx";
import { auth } from "../services/firebase/firebaseConfig";
import { createBusiness, setSellerStyle } from "../services/firebase/all_collections";
import { useAuthStore } from "../store/useAuthStore";

/** Perfil de estilo por defecto al crear un negocio (entrenamiento listo sin tocar Firebase a mano). */
const DEFAULT_SELLER_STYLE = {
  tone: "amigable",
  do: [],
  dont: [],
  signature: "",
  exampleReplies: [],
};

const ROUTES = {
  login: "/login",
  conversations: "/conversations",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm " +
  "placeholder:text-white/40 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10";
const LABEL_CLASS = "text-sm text-white/80";
const LINK_SECONDARY_CLASS =
  "text-xs text-white/70 hover:text-white underline underline-offset-4";

function useRegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError(null);
    const form = e.target;
    const name = form.querySelector("#register-name")?.value?.trim() || "";
    const email = form.querySelector("#register-email")?.value?.trim();
    const password = form.querySelector("#register-password")?.value;
    const confirm = form.querySelector("#register-confirm")?.value;
    if (!email || !password) return;
    if (password !== confirm) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const businessName = name || email?.split("@")[0] || "Mi negocio";
      await createBusiness(user.uid, {
        name: businessName,
        ownerUid: user.uid,
      });
      await setSellerStyle(user.uid, DEFAULT_SELLER_STYLE);
      const business = { id: user.uid, name: businessName, ownerUid: user.uid };
      setAuth(user, business);
      navigate(ROUTES.conversations);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setRegisterError("Ese email ya está registrado.");
      } else {
        setRegisterError(err.message || "Error al crear la cuenta.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((p) => !p);
  const toggleConfirmVisibility = () => setIsConfirmVisible((p) => !p);
  const handleGoogleRegister = () => {
    alert("Demo UI: aquí iría registro con Google");
  };

  return {
    isPasswordVisible,
    isConfirmVisible,
    togglePasswordVisibility,
    toggleConfirmVisibility,
    handleSubmit,
    handleGoogleRegister,
    isLoading,
    registerError,
  };
}

export default function RegisterPage() {
  const {
    isPasswordVisible,
    isConfirmVisible,
    togglePasswordVisibility,
    toggleConfirmVisibility,
    handleSubmit,
    handleGoogleRegister,
    isLoading,
    registerError,
  } = useRegisterForm();

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
                <h1 className="text-xl font-semibold mt-1">Crear cuenta</h1>
              </div>
              <img
                src={logoConversIA}
                alt="ConversIA Logo"
                className="h-24 w-24 rounded-xl object-cover"
              />
            </div>
            <p className="text-sm text-white/70 mt-3">
              Registrate para gestionar conversaciones y entrenar el bot.
            </p>
          </header>

          {registerError && (
            <p className="mx-6 mt-4 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
              {registerError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="register-name">
                Nombre
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="Tu nombre"
                className={INPUT_CLASS}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                placeholder="tu@email.com"
                className={INPUT_CLASS}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="register-password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={`${INPUT_CLASS} pr-12`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  aria-label={
                    isPasswordVisible ? "Ocultar contraseña" : "Ver contraseña"
                  }
                >
                  {isPasswordVisible ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="register-confirm">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="register-confirm"
                  type={isConfirmVisible ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={`${INPUT_CLASS} pr-12`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  aria-label={
                    isConfirmVisible
                      ? "Ocultar contraseña"
                      : "Ver contraseña"
                  }
                >
                  {isConfirmVisible ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 active:bg-white/80 transition disabled:opacity-50"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div className="relative py-2" aria-hidden>
              <div className="h-px bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-1 text-[11px] px-2 bg-black text-white/50">
                o
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm hover:bg-white/10 transition"
            >
              Continuar con Google
            </button>

            <p className="text-xs text-white/60 text-center pt-1">
              ¿Ya tenés cuenta?{" "}
              <Link
                to={ROUTES.login}
                className="text-white underline underline-offset-4 hover:text-white/90"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
          </div>

          <p className="text-center text-[11px] text-white/40 mt-4">
            · © {currentYear} ConversIA ·
          </p>
        </div>
      </div>
    </div>
  );
}
