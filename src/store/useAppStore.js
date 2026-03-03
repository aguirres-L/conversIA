import { create } from "zustand";

export const useAppStore = create((set) => ({
  conversations: [
    {
      id: "c1",
      name: "Cliente 1",
      last: "Quiero pagar el servicio",
      percentage: 50,
      status: "En curso",
      lastActivity: "Hace 2 min",
      messageCount: 4,
      channel: "WhatsApp",
      topic: "Pagos",
    },
    {
      id: "c2",
      name: "Cliente 2",
      last: "¿Precio del plan?",
      percentage: 45,
      status: "Pendiente",
      lastActivity: "Ayer, 18:30",
      messageCount: 2,
      channel: "Web",
      topic: "Consultas",
    },
    {
      id: "c3",
      name: "Cliente 3",
      last: "No me llega la factura",
      percentage: 80,
      status: "Resuelto",
      lastActivity: "Hace 1 h",
      messageCount: 8,
      channel: "Email",
      topic: "Soporte",
    },
  ],
  activeConversationId: "c1",

  messagesByConversation: {
    c1: [
      { from: "client", text: "Hola, quiero pagar el servicio" },
      { from: "bot", text: "Claro, ¿qué servicio deseas pagar?" },
    ],
    c2: [{ from: "client", text: "¿Cuánto cuesta el plan mensual?" }],
    c3: [
      { from: "client", text: "No me llega la factura" },
      { from: "bot", text: "Revisando tu caso. ¿Qué email usaste?" },
    ],
  },

  products: {
    // datos del cliente / catálogo
    items: [{ sku: "A1", name: "Servicio X", price: 20 }],
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),
  addProductItem: (item) =>
    set((state) => ({
      products: {
        ...state.products,
        items: [...state.products.items, { ...item, sku: item.sku || `ID-${Date.now()}` }],
      },
    })),
  removeProductItem: (sku) =>
    set((state) => ({
      products: {
        ...state.products,
        items: state.products.items.filter((i) => i.sku !== sku),
      },
    })),
  addMessage: (conversationId, msg) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] || []), msg],
      },
    })),
}));