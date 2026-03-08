import { create } from "zustand";

/**
 * Store de autenticación: usuario actual y negocio (business).
 * El login (o onAuthStateChanged) setea user y business.
 * Training y otras pantallas usan business.id y user.uid para llamar al backend.
 */
export const useAuthStore = create((set) => ({
  user: null, // { uid, email, ... } de Firebase Auth
  business: null, // { id, name, ... } de Firestore businesses
  authReady: false, // true después del primer onAuthStateChanged

  setUser: (user) => set({ user }),
  setBusiness: (business) => set({ business }),
  setAuth: (user, business) => set({ user, business }),
  setAuthReady: (authReady) => set({ authReady }),
  clearAuth: () => set({ user: null, business: null }),
}));
