import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";
import DesktopSidebar from "./DesktopSidebar.jsx";

export default function MobileShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col bg-white w-full">
      {/* TopBar: mismo en móvil y desktop */}
      <header className="h-14 px-4 flex items-center justify-between border-b shrink-0">
        <h1 className="font-semibold">ConversIA</h1>
        <button
          className="text-sm px-3 py-1.5 rounded-lg border md:hidden"
          onClick={() => navigate("/products")}
        >
          Productos
        </button>
      </header>

      {/* Contenido: en desktop sidebar + main, en móvil solo main */}
      <div className="flex-1 flex min-h-0">
        <DesktopSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* BottomNav: solo móvil, fija al fondo para no perder posición al hacer scroll */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
        <BottomNav />
      </div>
    </div>
  );
}
