import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const titles = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/predictions": "Predictions",
  "/analytics": "Analytics",
  "/chat": "Ask Pulse AI",
};

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-4 py-[18px] md:px-7">
      <h1 className="text-[22px] font-semibold tracking-tight">{titles[pathname] || "Pulse"}</h1>
      <div className="flex items-center gap-3.5">
        <button className="grid cursor-pointer place-items-center rounded-md border border-line p-[7px]" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="grid size-9 place-items-center rounded-full bg-brand-soft text-[13px] font-bold text-brand" aria-label="Signed in as Admin">
          AD
        </div>
      </div>
    </header>
  );
}
