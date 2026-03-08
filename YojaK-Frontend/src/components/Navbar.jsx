import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Home, Map, Mail, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/my-trips", label: "My Trips", icon: Map },
  { to: "/invites", label: "Invites", icon: Mail },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop top navbar — floating, rounded, glassy */}
      <div className="hidden md:block order-1 px-4 pt-3">
        <nav className="mx-auto max-w-6xl bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl shadow-lg shadow-black/5 flex items-center justify-between px-6 h-14">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--primary)]"
          >
            <img src="/logo.svg" alt="YojaK" className="h-8 w-8" />
            YojaK
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === to
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text-light)] hover:bg-[var(--cards)]/30 hover:text-[var(--primary)]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-[var(--cards)]/50">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile bottom navbar — floating, rounded, glassy */}
      <div className="md:hidden order-4 px-4 pb-3">
        <nav className="mx-auto max-w-md bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl shadow-lg shadow-black/8">
          <div className="flex items-center justify-around h-16 px-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                  pathname === to
                    ? "text-[var(--primary)] bg-[var(--cards)]/30"
                    : "text-[var(--text-light)]/60"
                }`}
              >
                <Icon size={20} strokeWidth={pathname === to ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            ))}
            <div className="flex flex-col items-center gap-0.5 py-1.5">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
