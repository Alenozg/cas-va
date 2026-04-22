import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";

export default function CartPage() {
  const { items, totalPrice, totalDiscount, updateQuantity, removeItem } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Marquee />
        <Header />
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <ShoppingBag size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">Sepetiniz Boş</h2>
          <p className="text-sm text-gray-400 mb-6">Sepetinize ürün ekleyerek alışverişe başlayın.</p>
          <Link to="/" className="btn-black">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      <div className="px-4 py-4">
        <h1 className="text-xl font-bold mb-1">Sepetiniz &bull; {items.length} Ürün</h1>

        {/* Countdown */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-bold font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <span className="text-xs text-gray-400">Siparişinizi tamamlamak için kalan süre</span>
        </div>

        {/* Progress - 5 Al 3 Öde */}
        <div className="mb-6 p-4 rounded-xl bg-gray-50">
          <p className="text-sm font-medium mb-2">5 AL 3 ÖDE</p>
          <div className="progress-bar mb-2">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (items.reduce((s,i) => s+i.quantity,0)/5)*100)}%` }} />
          </div>
          <p className="text-xs text-gray-400">{Math.max(0, 5 - items.reduce((s,i) => s+i.quantity,0))} ürün daha ekle, 5 al 3 öde fırsatını yakala!</p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <img src={item.image} alt={item.title} className="w-20 h-24 object-cover rounded-lg flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{item.model}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded" style={{ borderColor: "var(--color-border)" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1"><Minus size={12} /></button>
                    <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                </div>
                <p className="text-sm font-bold mt-2">{(item.price * item.quantity).toFixed(2)}TL</p>
              </div>
            </div>
          ))}
        </div>

        {/* Discount */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border rounded-lg" style={{ borderColor: "var(--color-border)" }}>
            <Tag size={14} className="text-gray-400" />
            <input placeholder="İndirim kodu" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" />
          </div>
          <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">Uygula</button>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-gray-50 mb-6">
          <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Ara Toplam</span><span className="font-semibold">{totalPrice.toFixed(2)}TL</span></div>
          <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">İndirim</span><span className="font-semibold text-green-600">-{totalDiscount.toFixed(2)}TL</span></div>
          <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Kargo</span><span className="font-semibold text-green-600">{totalPrice >= 950 ? "Ücretsiz" : "49.00TL"}</span></div>
          <div className="border-t pt-2 mt-2" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex justify-between"><span className="font-bold">Toplam</span><span className="font-bold text-lg">{(totalPrice + (totalPrice >= 950 ? 0 : 49)).toFixed(2)}TL</span></div>
          </div>
        </div>

        <Link to="/odeme" className="btn-black flex items-center justify-center gap-2">
          Ödeme <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
