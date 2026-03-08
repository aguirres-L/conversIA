import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { listConversations } from "../services/firebase/all_collections/conversations/conversationsService";
import { STATUS_VALUES } from "../services/firebase/all_collections/conversations/conversationsConfig";

function Avatar({ name, isActive }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
        isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {initial}
    </div>
  );
}

function normalize(str) {
  return (str ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/** Convierte Timestamp de Firestore o Date a texto relativo (ej. "Hace 2 min"). */
function formatRelative(ts) {
  if (!ts) return "";
  const date = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffH < 24) return `Hace ${diffH} h`;
  if (diffD === 1) return "Ayer";
  if (diffD < 7) return `Hace ${diffD} días`;
  return date.toLocaleDateString();
}

function statusToLabel(status) {
  if (status === STATUS_VALUES.closed) return "Resuelto";
  if (status === STATUS_VALUES.archived) return "Archivado";
  return "En curso";
}

export default function ConversationsPage() {
  const { business } = useAuthStore();
  const { activeConversationId, setActiveConversation } = useAppStore();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cargarConversaciones = useCallback(async () => {
    if (!business?.id) return;
    setLoading(true);
    setError(null);
    try {
      const lista = await listConversations(business.id, { max: 50 });
      const mapeadas = lista.map((c) => ({
        id: c.id,
        name: c.customer?.name || c.customer?.phone || "Sin nombre",
        last: c.lastMessage?.text || "—",
        percentage: c.lead?.score ?? 0,
        status: statusToLabel(c.status),
        lastActivity: formatRelative(c.lastMessage?.at ?? c.updatedAt),
        messageCount: c.unreadCount ?? 0,
        channel: c.channel || "",
        topic: c.lead?.stage ?? "",
      }));
      setConversations(mapeadas);
    } catch (err) {
      setError(err?.message ?? "Error al cargar conversaciones");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  useEffect(() => {
    cargarConversaciones();
  }, [cargarConversaciones]);

  const conversacionesFiltradas = useMemo(() => {
    const q = normalize(busqueda).trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        normalize(c.name).includes(q) ||
        normalize(c.last).includes(q) ||
        normalize(c.status).includes(q) ||
        normalize(c.channel).includes(q) ||
        normalize(c.topic).includes(q)
    );
  }, [conversations, busqueda]);

  if (!business) {
    return (
      <div className="p-4 text-center text-neutral-500">
        Cargando negocio…
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">Listado de Conversaciones</h2>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar chats..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          aria-label="Buscar conversaciones"
        />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500 py-4 text-center">
          Cargando conversaciones…
        </p>
      ) : conversacionesFiltradas.length === 0 ? (
        <p className="text-sm text-neutral-500 py-4 text-center">
          {busqueda
            ? "No hay conversaciones que coincidan con la búsqueda."
            : "No hay conversaciones aún. Cuando lleguen chats (p. ej. por WhatsApp vía n8n), aparecerán aquí."}
        </p>
      ) : (
        <div className="space-y-3">
          {conversacionesFiltradas.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const percentage = conv.percentage ?? 0;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  isActive ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={conv.name} isActive={isActive} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <p className="font-medium">{conv.name}</p>
                      {conv.status && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20"
                              : conv.status === "Resuelto"
                                ? "bg-emerald-100 text-emerald-700"
                                : conv.status === "En curso"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {conv.status}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-0.5 ${
                        isActive ? "opacity-80" : "text-neutral-500"
                      }`}
                    >
                      {conv.last}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className={`flex-1 h-2 rounded-full overflow-hidden ${
                          isActive ? "bg-white/20" : "bg-neutral-200"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isActive ? "bg-white" : "bg-neutral-600"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, percentage))}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div
                      className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs ${
                        isActive ? "text-white/70" : "text-neutral-400"
                      }`}
                    >
                      {conv.lastActivity && (
                        <span>{conv.lastActivity}</span>
                      )}
                      {conv.channel && (
                        <span>{conv.channel}</span>
                      )}
                      {conv.messageCount != null && (
                        <span>{conv.messageCount} mensajes</span>
                      )}
                      {conv.topic && (
                        <span
                          className={
                            isActive
                              ? "text-white/90"
                              : "text-neutral-500 font-medium"
                          }
                        >
                          #{conv.topic}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
