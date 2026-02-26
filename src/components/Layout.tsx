import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarDays, BarChart3, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AGRLogo from "@/components/AGRLogo";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/polls", label: "Polls", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-50 nav-glass">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <AGRLogo className="h-7" />
            <div className="hidden sm:block h-5 w-px bg-border" />
            <span className="hidden sm:inline text-[13px] font-medium text-muted-foreground">
              Party Committee
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center bg-secondary/60 rounded-full p-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full -z-10 badge-glow"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="sm:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="container py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground badge-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} AGR Inventory · Party Committee
      </footer>
    </div>
  );
}
