import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(true)} className="p-1">
          <Menu size={22} />
        </button>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-1" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} />
          </button>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="p-1">
                <User size={20} />
              </button>
              <div className="absolute right-0 top-8 w-44 bg-white border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50" style={{ borderColor: "var(--color-border)" }}>
                <div className="px-3 py-2 border-b text-xs text-gray-400 truncate" style={{ borderColor: "var(--color-border)" }}>
                  {user?.name || user?.email}
                </div>
                {user?.role === "admin" && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                    <LayoutDashboard size={14} /> Admin Paneli
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full text-left text-red-500">
                  <LogOut size={14} /> Çıkış Yap
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="p-1">
              <User size={20} />
            </Link>
          )}
          <button className="p-1 relative" onClick={openCart}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="px-4 pb-3">
          <input
            autoFocus
            placeholder="Ürün ara..."
            className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:border-black"
            style={{ borderColor: "var(--color-border)" }}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
            <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-6 space-y-1">
            {[
              { label: "Ana Sayfa", to: "/" },
              { label: "Sepet", to: "/sepet" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block text-lg font-medium py-3 border-b"
                style={{ borderColor: "var(--color-border)" }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link to="/admin" className="block text-lg font-medium py-3 border-b" style={{ borderColor: "var(--color-border)" }} onClick={() => setMenuOpen(false)}>
                    Admin Paneli
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block text-lg font-medium py-3 text-red-500 w-full text-left"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-lg font-medium py-3" onClick={() => setMenuOpen(false)}>
                Giriş Yap / Kayıt Ol
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
