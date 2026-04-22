import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Package, DollarSign, Clock, CheckCircle, XCircle, Truck, Search, TrendingUp, Users, BarChart3 } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city: string;
  totalAmount: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{ productId: string; title: string; price: number; quantity: number; model: string }>;
  createdAt: string;
}

const STATUS_LABELS = {
  pending: { label: "Bekliyor", color: "#FCD34D", icon: Clock },
  processing: { label: "İşleniyor", color: "#67E8F9", icon: Package },
  shipped: { label: "Kargoda", color: "#A78BFA", icon: Truck },
  delivered: { label: "Teslim Edildi", color: "#34D399", icon: CheckCircle },
  cancelled: { label: "İptal", color: "#EF4444", icon: XCircle },
};

const DEMO_ORDERS: Order[] = [
  { id: 1, orderNumber: "CV1A2B3C", customerName: "Ayşe Yılmaz", customerEmail: "ayse@example.com", customerPhone: "05551234567", shippingAddress: "Atatürk Cad. No:45", city: "İstanbul", totalAmount: "599.98", status: "pending", items: [{ productId: "1", title: "Mystic Lovers Eye", price: 299.99, quantity: 2, model: "iPhone 15 Pro" }], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, orderNumber: "CV4D5E6F", customerName: "Mehmet Kaya", customerEmail: "mehmet@example.com", customerPhone: "05329876543", shippingAddress: "Cumhuriyet Mah. 123. Sok.", city: "Ankara", totalAmount: "299.99", status: "processing", items: [{ productId: "2", title: "Helmet Kiss", price: 299.99, quantity: 1, model: "iPhone 16 Pro Max" }], createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, orderNumber: "CV7G8H9I", customerName: "Zeynep Demir", customerEmail: "zeynep@example.com", customerPhone: "05445557890", shippingAddress: "Barbaros Bulvarı No:112", city: "İzmir", totalAmount: "899.97", status: "shipped", items: [{ productId: "3", title: "Cozy Bear Love", price: 299.99, quantity: 3, model: "iPhone 15" }], createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 4, orderNumber: "CV0J1K2L", customerName: "Ali Şahin", customerEmail: "ali@example.com", customerPhone: "05554443333", shippingAddress: "Bağdat Cad. No:234", city: "İstanbul", totalAmount: "299.99", status: "delivered", items: [{ productId: "4", title: "Light Fury Eye", price: 299.99, quantity: 1, model: "iPhone 13 Pro" }], createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 5, orderNumber: "CV3M4N5O", customerName: "Selin Özdemir", customerEmail: "selin@example.com", customerPhone: "05332221111", shippingAddress: "Tunalı Hilmi Cad. No:56", city: "Ankara", totalAmount: "599.98", status: "pending", items: [{ productId: "5", title: "Moto Queen", price: 299.99, quantity: 2, model: "iPhone 16 Pro" }], createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    const savedOrders = saved ? JSON.parse(saved) : [];
    const allOrders = [...savedOrders, ...DEMO_ORDERS];
    // Deduplicate by orderNumber
    const uniqueOrders = allOrders.filter((order: Order, index: number, self: Order[]) => index === self.findIndex((o: Order) => o.orderNumber === order.orderNumber));
    setOrders(uniqueOrders);
  }, []);

  const updateStatus = (id: number, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = orders
    .filter((o) => (filter === "all" ? true : o.status === filter))
    .filter((o) => search === "" || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: orders.length,
    revenue: orders.reduce((s, o) => s + parseFloat(o.totalAmount), 0),
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/" className="text-xs text-gray-400 flex items-center gap-1 mb-1"><ArrowLeft size={12} /> Mağazaya Dön</Link>
            <h1 className="text-xl font-bold">Admin Paneli</h1>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Toplam Sipariş", value: stats.total, icon: Package, color: "#000" },
            { label: "Toplam Gelir", value: `${stats.revenue.toFixed(0)}TL`, icon: DollarSign, color: "#22C55E" },
            { label: "Bekleyen", value: stats.pending, icon: Clock, color: "#FCD34D" },
            { label: "Teslim Edilen", value: stats.delivered, icon: CheckCircle, color: "#34D399" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-3 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400">{label}</span>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="text-lg font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white mb-4" style={{ borderColor: "var(--color-border)" }}>
          <Search size={16} className="text-gray-400" />
          <input placeholder="Sipariş no veya müşteri ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {[{ key: "all", label: "Tümü" }, { key: "pending", label: "Bekliyor" }, { key: "processing", label: "İşleniyor" }, { key: "shipped", label: "Kargoda" }, { key: "delivered", label: "Teslim" }, { key: "cancelled", label: "İptal" }].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === key ? "bg-black text-white" : "bg-white border text-gray-600"}`} style={filter !== key ? { borderColor: "var(--color-border)" } : {}}>
              {label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_LABELS[order.status];
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }} onClick={() => setSelected(order)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold">{order.orderNumber}</span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                    <Icon size={10} />{cfg.label}
                  </span>
                </div>
                <p className="text-sm font-medium">{order.customerName}</p>
                <p className="text-xs text-gray-400">{order.city}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">{parseFloat(order.totalAmount).toFixed(2)}TL</span>
                  <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-8">Sipariş bulunamadı.</p>}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Sipariş Detayı</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">✕</button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Sipariş No</span><span className="font-mono font-semibold">{selected.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Müşteri</span><span>{selected.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">E-posta</span><span>{selected.customerEmail}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Telefon</span><span>{selected.customerPhone || "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Adres</span><span className="text-right text-xs">{selected.shippingAddress}, {selected.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tarih</span><span>{new Date(selected.createdAt).toLocaleDateString("tr-TR")}</span></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold mb-2">Ürünler</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-1"><span>{item.title} ({item.model}) x{item.quantity}</span><span>{(item.price * item.quantity).toFixed(2)}TL</span></div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold" style={{ borderColor: "var(--color-border)" }}>
                <span>Toplam</span><span>{parseFloat(selected.totalAmount).toFixed(2)}TL</span>
              </div>
            </div>
            <p className="text-xs font-semibold mb-2">Durum Güncelle</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((status) => {
                const c = STATUS_LABELS[status];
                const I = c.icon;
                return (
                  <button key={status} onClick={() => updateStatus(selected.id, status)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${c.color}20`, color: c.color }}>
                    <I size={12} />{c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
