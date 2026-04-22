import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";

export default function CheckoutPage() {
  const { items, totalPrice, totalDiscount, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });

  const shipping = totalPrice >= 950 ? 0 : 49;
  const grandTotal = totalPrice + shipping;

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setOrderNum(data.orderNumber);
      setSubmitted(true);
      clearCart();
    },
    onError: (err) => {
      alert("Sipariş oluşturulamadı: " + err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone || undefined,
      shippingAddress: form.address,
      city: form.city,
      postalCode: form.postalCode || undefined,
      totalAmount: grandTotal,
      items: items.map((i) => ({
        productId: Number(i.productId) || 0,
        title: i.title,
        price: Number(i.price),
        quantity: i.quantity,
        model: i.model,
        image: i.image,
      })),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Siparişiniz Alındı!</h2>
          <p className="text-sm text-gray-500 mb-2">Sipariş numaranız:</p>
          <p className="text-xl font-bold font-mono mb-6">{orderNum}</p>
          <p className="text-xs text-gray-400 mb-6">
            Sipariş detayları e-posta adresinize gönderildi. 1-3 iş günü içinde kargoya verilecektir.
          </p>
          <Link to="/" className="btn-black">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Sepetiniz Boş</h2>
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
        <Link to="/sepet" className="inline-flex items-center gap-1 text-sm text-gray-500 mb-4">
          <ChevronLeft size={16} /> Sepete Dön
        </Link>
        <h1 className="text-xl font-bold mb-6">Ödeme</h1>

        <div className="max-w-lg mx-auto">
          <div className="p-4 rounded-xl border mb-6 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">PayTR ile Güvenli Ödeme</p>
              <p className="text-xs text-gray-400">256-bit SSL şifreleme ile güvenli ödeme</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Truck size={16} /> Teslimat Bilgileri
              </h3>
              <div className="space-y-3">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Ad Soyad *" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="E-posta *" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Telefon *" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Adres *" rows={3} className="w-full px-4 py-3 border rounded-lg text-sm resize-none outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                <div className="grid grid-cols-2 gap-3">
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="Şehir *" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Posta Kodu" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-black" style={{ borderColor: "var(--color-border)" }} />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-gray-50">
              <h3 className="text-sm font-semibold mb-3">Sipariş Özeti</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1">{item.title} x{item.quantity}</span>
                    <span className="font-medium">{(Number(item.price) * item.quantity).toFixed(2)}TL</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 space-y-1" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Ara Toplam</span><span>{totalPrice.toFixed(2)}TL</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">İndirim</span><span className="text-green-600">-{totalDiscount.toFixed(2)}TL</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Kargo</span><span className="text-green-600">{shipping === 0 ? "Ücretsiz" : shipping + "TL"}</span></div>
                <div className="flex justify-between text-base font-bold pt-1"><span>Toplam</span><span>{grandTotal.toFixed(2)}TL</span></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending}
              className="btn-black flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              {createOrder.isPending ? "İşleniyor..." : "Siparişi Tamamla"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
