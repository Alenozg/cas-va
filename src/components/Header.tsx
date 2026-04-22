import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, ShoppingBag, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-3 gap-3">

        {/* Sol: Hamburger */}
        <button onClick={() => setMenuOpen(true)} className="p-1 shrink-0">
          <Menu size={22} />
        </button>

        {/* Orta: Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Casiva
          </span>
        </Link>

        {/* Sağ: Arama + Auth + Sepet */}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setSearchOpen(s => !s)} className="p-1">
            <Search size={20} />
          </button>

          {/* AUTH ALANI */}
          {!isLoading && (
            isAuthenticated ? (
              /* Giriş yapıldı: isim + dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="hidden sm:block max-w-[80px] truncate">{user?.name || user?.email?.split("@")[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-10 z-50 w-52 bg-white border rounded-2xl shadow-xl overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                      <div className="px-4 py-3 border-b bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-xs font-semibold text-gray-900 truncate">{user?.name || "Kullanıcı"}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b transition-colors"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <LayoutDashboard size={15} /> Admin Paneli
                        </button>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Giriş yapılmadı: belirgin buton */
              <Link
                to="/login"
                className="px-4 py-1.5 bg-black text-white text-sm font-semibold rounded-full hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                Giriş Yap
              </Link>
            )
          )}

          {/* Sepet */}
          <button className="p-1 relative shrink-0" onClick={openCart}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Arama çubuğu */}
      {searchOpen && (
        <div className="px-4 pb-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <input
            autoFocus
            placeholder="Ürün ara..."
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-black mt-2"
            style={{ borderColor: "var(--color-border)" }}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      )}

      {/* Mobil menü */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
            <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
          </div>

          {/* Kullanıcı durumu - üstte belirgin */}
          <div className="px-4 py-4 border-b bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{user?.name || "Kullanıcı"}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-1.5 text-sm text-red-500 font-medium"
                >
                  <LogOut size={14} /> Çıkış
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl text-center">
                  Giriş Yap
                </Link>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 border border-black text-sm font-semibold rounded-xl text-center">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
            {[
              { label: "Ana Sayfa", to: "/" },
              { label: "Sepetim", to: "/sepet" },
              { label: "Sipariş Ver", to: "/odeme" },
            ].map((item) => (
              <Link key={item.label} to={item.to}
                className="flex items-center justify-between py-3.5 px-2 border-b text-base font-medium"
                style={{ borderColor: "var(--color-border)" }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link to="/admin"
                className="flex items-center gap-2 py-3.5 px-2 border-b text-base font-medium text-[#1a1a2e]"
                style={{ borderColor: "var(--color-border)" }}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} /> Admin Paneli
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
