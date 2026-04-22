import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(true)} className="p-1">
          <Menu size={22} />
        </button>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="p-1"><Search size={20} /></button>
          <button className="p-1 relative" onClick={openCart}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
            <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-6 space-y-4">
            {["Ana Sayfa", "Koleksiyonlar", "Anime Tasarımları", "Çok Satanlar", "İletişim"].map((item) => (
              <Link key={item} to={item === "Ana Sayfa" ? "/" : `/#${item.toLowerCase().replace(/\s/g, "-")}`} className="block text-lg font-medium py-2 border-b" style={{ borderColor: "var(--color-border)" }} onClick={() => setMenuOpen(false)}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
