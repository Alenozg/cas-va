import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router";

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md flex flex-col"
        style={{
          backgroundColor: "var(--bg-card)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sepetim
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} style={{ color: "var(--text-muted)" }} />
              <p className="mt-4" style={{ color: "var(--text-muted)" }}>
                Sepetiniz boş
              </p>
              <button
                onClick={closeCart}
                className="mt-4 btn-outline text-sm"
              >
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(26, 16, 37, 0.5)" }}
                >
                  <img
                    src={item.image || "/hero-bg.jpg"}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.title}</h4>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {item.model}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--bg-dark)" }}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--bg-dark)" }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--primary)" }}>
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} TL
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t space-y-4" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Ara Toplam</span>
              <span className="text-xl font-bold">{totalPrice.toFixed(2)} TL</span>
            </div>
            <Link
              to="/odeme"
              onClick={closeCart}
              className="block w-full text-center btn-primary"
            >
              Ödemeye Geç
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm py-2 transition-colors hover:text-red-400"
              style={{ color: "var(--text-muted)" }}
            >
              Sepeti Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}
