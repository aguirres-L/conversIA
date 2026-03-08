import { NavLink, useNavigate } from "react-router-dom";

const linkBase =
  "block px-4 py-3 rounded-lg text-sm transition hover:bg-neutral-100";
const linkActive = "font-semibold bg-neutral-100";
const linkInactive = "text-neutral-600";

export default function DesktopSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:bg-neutral-50 md:shrink-0">
      <nav className="p-3 space-y-1">
        <NavLink
          to="/conversations"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Conversaciones
        </NavLink>
        <NavLink
          to="/training"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Entrenamiento
        </NavLink>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className={`${linkBase} ${linkInactive} w-full text-left`}
        >
          Productos
        </button>


          <button
            type="button"
            onClick={() => navigate("/graph")}
            className={`${linkBase} ${linkInactive} w-full text-left`}
          >
            Gráficos
          </button>

      </nav>
    </aside>
  );
}
