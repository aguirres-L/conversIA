import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase/firebaseConfig";
import { getBusinessByOwnerUid } from "./services/firebase/all_collections";
import { useAuthStore } from "./store/useAuthStore";
import { RouterConservia } from "./router/RouterConservia";

export default function App() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        clearAuth();
        setAuthReady(true);
        return;
      }
      const business = await getBusinessByOwnerUid(user.uid);
      setAuth(user, business);
      setAuthReady(true);
    });
    return () => unsub();
  }, [clearAuth, setAuth, setAuthReady]);

  return (
    <BrowserRouter>
      <RouterConservia />
    </BrowserRouter>
  );
}