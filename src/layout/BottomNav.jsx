import { NavLink } from "react-router-dom";
import Botsvg from "../components/svg/Botsvg";
import Listsvg from "../components/svg/Listsvg";
import Graphsvg from "../components/svg/Graphsvg";

const circleBase =
  "w-60 h-12 rounded-full flex items-center justify-center transition-colors";
const circleActive = "bg-black text-white";
const circleInactive = "bg-neutral-100 text-neutral-500";

export default function BottomNav() {
  return (
    <div className="h-16 flex border-t items-center justify-center gap-6 px-4">
      <NavLink
        to="/conversations"
        className={({ isActive }) =>
          `${circleBase} ${isActive ? circleActive : circleInactive}`
        }
      >
        <Listsvg />
      </NavLink>
      <NavLink
        to="/training"
        className={({ isActive }) =>
          `${circleBase} ${isActive ? circleActive : circleInactive}`
        }
      >
        <Botsvg />
      </NavLink>
      <NavLink
        to="/graph"
        className={({ isActive }) =>
          `${circleBase} ${isActive ? circleActive : circleInactive}`
        }
      >
        <Graphsvg />
      </NavLink>
    </div>
  );
}