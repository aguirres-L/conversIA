import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";
import DesktopSidebar from "./DesktopSidebar.jsx";
import FrameMotionComponent from "../hooks/frame_motion/FrameMotionComponen.jsx";
import ArrowUnder from "../components/svg/ArrowUnder.jsx";
import ArrowUp from "../components/svg/ArrowUp.jsx";
import { useAuthStore } from "../store/useAuthStore";
import CoffeeSvg from "../components/svg/CoffeSvg.jsx";
import ListProductSvg from "../components/svg/ListProductSvg.jsx";

export default function MobileShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authReady } = useAuthStore();

  if (authReady && !user) {
    return <Navigate to="/login" replace />;
  }

  const isProductsPage = location.pathname === "/products";
  const isInfoJobPage = location.pathname === "/info-job";
  const seeProducts = () => navigate("/products");
  const seeInfoJob = () => navigate("/info-job");
  // Volver siempre a una ruta con BottomNav (evita loop products ↔ info-job)
  const goBackToMain = () => navigate("/conversations", { replace: true });

  return (
    <div className="min-h-dvh flex flex-col bg-white w-full">
      {/* TopBar: ConversIA arriba; Info Job y Productos en fila debajo (mejor jerarquía UX) */}
      <header className="border-b shrink-0">
        <div className="h-14 px-4 flex items-center">
          <h1 className="font-semibold">ConversIA</h1>
        </div>
        <div className="md:hidden px-4 pb-3 flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border bg-neutral-50 hover:bg-neutral-100 transition-colors"
            onClick={isInfoJobPage ? goBackToMain : seeInfoJob}
            aria-label={isInfoJobPage ? "Volver" : "Ver Info Job"}
          >
            <CoffeeSvg />
            <span> Job</span>
            {isInfoJobPage ? <ArrowUp /> : <ArrowUnder />}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border bg-neutral-50 hover:bg-neutral-100 transition-colors"
            onClick={isProductsPage ? goBackToMain : seeProducts}
            aria-label={isProductsPage ? "Volver" : "Ver productos"}
          >
            <ListProductSvg />
            <span>Productos</span>
            {isProductsPage ? <ArrowUp /> : <ArrowUnder />}
          </button>
        </div>
      </header>

      {/* Contenido: en desktop sidebar + main, en móvil solo main */}
      <div className="flex-1 flex min-h-0">
        <DesktopSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto pb-16 md:pb-0">
          <FrameMotionComponent
            key={location.pathname}
            type="fadeUp"
            className="flex-1 flex flex-col min-w-0 min-h-0"
          >
            <Outlet />
          </FrameMotionComponent>
        </main>
      </div>

      {/* BottomNav: solo móvil, no se muestra en /products */}
      {!isProductsPage && !isInfoJobPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
