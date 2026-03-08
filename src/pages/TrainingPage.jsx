import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { sendTrainingMessage, checkBackendHealth } from "../services/api/aiApi";

const ROUTES = { login: "/login" };

export default function TrainingPage() {
  const { user, business } = useAuthStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null); // { ok, message }
  const sessionIdRef = useRef(`training_${Date.now()}`);

  useEffect(() => {
    checkBackendHealth().then(setBackendStatus);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    if (!business?.id || !user?.uid) {
      setError("Iniciá sesión para usar el entrenamiento con el bot.");
      return;
    }

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text }]);
    setIsLoading(true);

    try {
      const res = await sendTrainingMessage(
        business.id,
        user.uid,
        text,
        sessionIdRef.current
      );
      setMessages((prev) => [...prev, { from: "bot", text: res.replyText }]);
    } catch (err) {
      setError(err.message || "Error al llamar al bot.");
      setMessages((prev) => [...prev, { from: "bot", text: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !business) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <p className="text-neutral-600 mb-4">
          Iniciá sesión para entrenar el bot con el estilo de tu negocio.
        </p>
        <Link
          to={ROUTES.login}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Entrenamiento del Bot</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Probá respuestas del bot (estilo de {business.name || "tu negocio"}).
            </p>
          </div>
          {backendStatus !== null && (
            <span
              className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                backendStatus.ok
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-800"
              }`}
              title={backendStatus.message}
            >
              {backendStatus.ok ? "Backend conectado" : "Backend sin conexión"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            Escribí un mensaje para ver cómo respondería el bot.
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.from === "bot"
                ? "bg-black text-white ml-0 mr-auto"
                : "bg-neutral-200 ml-auto mr-0"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-neutral-100 text-neutral-500 ml-0 mr-auto">
            ...
          </div>
        )}
      </div>

      {error && (
        <p className="px-4 py-2 text-sm text-red-600 bg-red-50">{error}</p>
      )}

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribí un mensaje..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}