import { Link, useLocation } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";
import { Home, Map, Mail, User, LogOut } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/my-trips", label: "My Trips", icon: Map },
  { to: "/invites", label: "Invites", icon: Mail },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

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
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--cards)]/30"
                  title="Profile"
                >
                  <img
                    src={user?.imageUrl || "/logo.svg"}
                    alt="profile"
                    className="h-7 w-7 rounded-full border border-[var(--cards)]/70 object-cover"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
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
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex flex-col items-center gap-0.5 py-1.5 text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="text-[10px] font-semibold">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
