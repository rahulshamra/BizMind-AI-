import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, TrendingUp, BarChart3, MessageSquare, Activity } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/predictions", label: "Predictions", icon: TrendingUp },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/chat", label: "Ask Pulse AI", icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 bg-ink p-3 text-[#D8E2E0] md:sticky md:top-0 md:h-screen md:w-[232px] md:px-3.5 md:py-[22px]">
      <div className="flex items-center gap-2.5 px-2.5 pb-2.5 text-xl font-bold text-white md:pb-6">
        <Activity size={22} />
        <span>Pulse</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 ${
                isActive ? "bg-brand text-white" : "hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
