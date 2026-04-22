import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router";

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60" onClick={closeCart} />
      <div className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sepetim
          </h2>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-400 mb-4">Sepetiniz boş</p>
              <button onClick={closeCart} className="px-6 py-2 border border-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                  <img
                    src={item.image || "/hero-bg.jpg"}
                    alt={item.title}
                    className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{item.model}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg" style={{ borderColor: "var(--color-border)" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100 rounded-l-lg"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 rounded-r-lg"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                    <p className="text-sm font-bold mt-2">
                      {(Number(item.price) * item.quantity).toFixed(2)} TL
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ara Toplam</span>
              <span className="text-xl font-bold">{totalPrice.toFixed(2)} TL</span>
            </div>
            <Link
              to="/odeme"
              onClick={closeCart}
              className="btn-black text-center"
            >
              Ödemeye Geç
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm py-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              Sepeti Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}
