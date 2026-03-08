import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import logoConversIA from "../../public/ca.png";
import HeroComponent from "../components/hero/HeroComponent";
import { auth } from "../services/firebase/firebaseConfig";
import { getBusinessByOwnerUid } from "../services/firebase/all_collections";
import { useAuthStore } from "../store/useAuthStore";

const ROUTES = {
  conversations: "/conversations",
  forgot: "/forgot",
  register: "/register",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm " +
  "placeholder:text-white/40 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10";
const LABEL_CLASS = "text-sm text-white/80";
const LINK_SECONDARY_CLASS = "text-xs text-white/70 hover:text-white underline underline-offset-4";

function useLoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    const form = e.target;
    const email = form.querySelector("#login-email")?.value?.trim();
    const password = form.querySelector("#login-password")?.value;
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const business = await getBusinessByOwnerUid(user.uid);
      setAuth(user, business);
      navigate(ROUTES.conversations);
    } catch (err) {
      setLoginError(err.code === "auth/invalid-credential" || err.code === "auth/user-not-found"
        ? "Email o contraseña incorrectos."
        : err.message || "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleGoogleLogin = () => {
    // TODO: implementar login con Google
    alert("Demo UI: aquí iría login con Google");
  };

  return {
    isPasswordVisible,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleLogin,
    isLoading,
    loginError,
  };
}

function LoginConversIA() {
  const {
    isPasswordVisible,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleLogin,
    isLoading,
    loginError,
  } = useLoginForm();

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-dvh bg-black text-white relative overflow-hidden">
      {/* Hero de fondo: efecto visual a la izquierda */}
      <div className="absolute inset-0 z-0">
        <HeroComponent />
      </div>

      {/* Login en primer plano: card opaca por delante */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-sm shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <header className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-widest text-white/60">CONVERSIA</p>
                  <h1 className="text-xl font-semibold mt-1">Iniciar sesión</h1>
                </div>
                <img src={logoConversIA} alt="ConversIA Logo" className="h-24 w-24 rounded-xxl object-contain" />
              </div>
              <p className="text-sm text-white/70 mt-3">
                Accedé al panel para gestionar conversaciones y entrenar el bot.
              </p>
            </header>
            {loginError && (
              <p className="mx-6 mt-4 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}
            {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="tu@email.com"
                className={INPUT_CLASS}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS} htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={`${INPUT_CLASS} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {isPasswordVisible ? "Ocultar" : "Ver"}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-white/70 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                    aria-label="Recordarme"
                  />
                  Recordarme
                </label>
                <Link to={ROUTES.forgot} className={LINK_SECONDARY_CLASS}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 active:bg-white/80 transition disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <div className="relative py-2" aria-hidden>
              <div className="h-px bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-1 text-[11px] px-2 bg-black text-white/50">
                o
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm hover:bg-white/10 transition"
            >
              Continuar con Google
            </button>

            <p className="text-xs text-white/60 text-center pt-1">
              ¿No tenés cuenta?{" "}
              <Link
                to={ROUTES.register}
                className="text-white underline underline-offset-4 hover:text-white/90"
              >
                Crear cuenta
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

export default LoginConversIA;
