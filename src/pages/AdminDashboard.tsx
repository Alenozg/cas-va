import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  ArrowLeft, Search, Bell, ChevronDown, ChevronRight,
  Clock, CheckCircle, XCircle, Truck, RefreshCw, Eye,
  ArrowUpRight, ArrowDownRight, Filter, Download, MoreHorizontal,
  Tag, BarChart2, DollarSign, Settings, LogOut, X, Edit2, Check
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type AdminPage = "dashboard" | "orders" | "products" | "customers";

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: "Bekliyor",     color: "#92400e", bg: "#FEF3C7", icon: Clock },
  processing: { label: "İşleniyor",   color: "#1e40af", bg: "#DBEAFE", icon: RefreshCw },
  shipped:    { label: "Kargoda",     color: "#5b21b6", bg: "#EDE9FE", icon: Truck },
  delivered:  { label: "Teslim",      color: "#065f46", bg: "#D1FAE5", icon: CheckCircle },
  cancelled:  { label: "İptal",       color: "#991b1b", bg: "#FEE2E2", icon: XCircle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}>
      <Icon size={10} />{cfg.label}
    </span>
  );
}

function Sidebar({ page, setPage, user, logout }: {
  page: AdminPage; setPage: (p: AdminPage) => void;
  user: any; logout: () => void;
}) {
  const nav = [
    { id: "dashboard", icon: LayoutDashboard, label: "Genel Bakış" },
    { id: "orders",    icon: ShoppingBag,     label: "Siparişler" },
    { id: "products",  icon: Package,          label: "Ürünler" },
    { id: "customers", icon: Users,            label: "Müşteriler" },
  ] as const;

  return (
    <aside className="w-64 bg-[#1a1a2e] flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#1a1a2e] font-black text-sm">C</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Casiva Admin</p>
            <p className="text-white/40 text-[10px]">Yönetim Paneli</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setPage(id as AdminPage)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              page === id ? "bg-white text-[#1a1a2e]" : "text-white/60 hover:text-white hover:bg-white/10"
            }`}>
            <Icon size={16} />{label}
          </button>
        ))}
        <div className="border-t border-white/10 pt-2 mt-2">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft size={16} />Mağazaya Dön
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user?.name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors p-1">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ─── DASHBOARD ─── */
function DashboardPage() {
  const { data: stats, isLoading } = trpc.order.stats.useQuery();

  if (isLoading) return <PageLoader />;

  const cards = [
    { label: "Toplam Gelir", value: `₺${(stats?.totalRevenue ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`, sub: `Bu ay ₺${(stats?.monthRevenue ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 0 })}`, growth: stats?.revenueGrowth ?? 0, icon: DollarSign, color: "#10b981" },
    { label: "Toplam Sipariş", value: stats?.totalOrders ?? 0, sub: `Bu ay ${stats?.monthOrders ?? 0} sipariş`, growth: 0, icon: ShoppingBag, color: "#6366f1" },
    { label: "Bekleyen", value: stats?.pendingOrders ?? 0, sub: "İşlem bekliyor", growth: 0, icon: Clock, color: "#f59e0b" },
    { label: "Müşteriler", value: stats?.totalCustomers ?? 0, sub: "Kayıtlı kullanıcı", growth: 0, icon: Users, color: "#ec4899" },
  ];

  const days = stats?.salesByDay ?? [];
  const maxRev = Math.max(...days.map(d => d.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const pos = c.growth >= 0;
          return (
            <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color + "20" }}>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
                {c.growth !== 0 && (
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${pos ? "text-emerald-600" : "text-red-500"}`}>
                    {pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(c.growth)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              <p className="text-xs text-gray-500 font-medium mt-2">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Satış Grafiği</h3>
              <p className="text-xs text-gray-400">Son 7 gün</p>
            </div>
            <BarChart2 size={18} className="text-gray-300" />
          </div>
          <div className="flex items-end gap-2 h-32">
            {days.map((d, i) => {
              const h = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0;
              const label = new Date(d.date).toLocaleDateString("tr-TR", { weekday: "short" });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative group">
                    <div className="w-full rounded-t-lg bg-[#1a1a2e] transition-all" style={{ height: `${Math.max(h, 4)}%`, minHeight: 6, maxHeight: "100%", height: `${Math.max(h * 1.1, 6)}px` }} />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      ₺{d.revenue.toFixed(0)} • {d.orders} sipariş
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Durum Dağılımı</h3>
          <p className="text-xs text-gray-400 mb-4">Son 100 sipariş</p>
          <div className="space-y-3">
            {(Object.entries(STATUS_CFG) as [OrderStatus, typeof STATUS_CFG[OrderStatus]][]).map(([key, cfg]) => {
              const count = stats?.byStatus?.[key] ?? 0;
              const total = Object.values(stats?.byStatus ?? {}).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 font-medium">{cfg.label}</span>
                    <span className="text-xs font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ORDERS ─── */
function OrdersPage() {
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const { data: orders = [], refetch } = trpc.order.list.useQuery({ status, search: search || undefined });
  const updateStatus = trpc.order.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-400 text-sm">{orders.length} sipariş listeleniyor</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Sipariş no, müşteri adı veya e-posta ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[["all","Tümü"],["pending","Bekliyor"],["processing","İşleniyor"],["shipped","Kargoda"],["delivered","Teslim"],["cancelled","İptal"]].map(([k,l]) => (
            <button key={k} onClick={() => setStatus(k as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${status === k ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Sipariş","Müşteri","Tarih","Ürünler","Tutar","Durum",""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders as any[]).map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-bold text-[#1a1a2e]">#{o.orderNumber}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString("tr-TR", { day:"2-digit", month:"short", year:"numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {(o.items as any[]).length} ürün
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-gray-900">₺{parseFloat(o.totalAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">Sipariş bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Sipariş #{selected.orderNumber}</h2>
                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={16} /></button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Müşteri Bilgileri</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[["Ad Soyad", selected.customerName], ["E-posta", selected.customerEmail], ["Telefon", selected.customerPhone||"-"], ["Şehir", selected.city]].map(([l,v]) => (
                    <div key={l}><p className="text-[10px] text-gray-400">{l}</p><p className="font-medium text-gray-900">{v}</p></div>
                  ))}
                </div>
                <div className="mt-2"><p className="text-[10px] text-gray-400">Adres</p><p className="font-medium text-gray-900 text-sm">{selected.shippingAddress}</p></div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Ürünler</p>
                <div className="space-y-2">
                  {(selected.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.model} • x{item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm">₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 font-bold text-gray-900">
                  <span>Toplam</span><span>₺{parseFloat(selected.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Durum Güncelle</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(STATUS_CFG) as [OrderStatus, any][]).map(([s, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = selected.status === s;
                    return (
                      <button key={s}
                        onClick={() => { updateStatus.mutate({ id: selected.id, status: s }); setSelected({ ...selected, status: s }); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${isActive ? "border-transparent" : "border-gray-200 hover:border-gray-300"}`}
                        style={isActive ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color + "40" } : {}}>
                        <Icon size={11} />{cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PRODUCTS ─── */
function ProductsPage() {
  const [search, setSearch] = useState("");
  const [editPrice, setEditPrice] = useState<{ id: number; price: string; compare: string } | null>(null);

  const { data, isLoading, refetch } = trpc.product.adminList.useQuery({ search: search || undefined });
  const updatePrice = trpc.product.updatePrice.useMutation({ onSuccess: () => { refetch(); setEditPrice(null); } });
  const seedMutation = trpc.product.seed.useMutation({ onSuccess: () => refetch() });

  const items = data?.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-400 text-sm">{data?.total ?? 0} ürün toplam</p>
        </div>
        {(data?.total ?? 0) === 0 && (
          <button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}
            className="px-4 py-2.5 bg-[#1a1a2e] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
            {seedMutation.isPending ? "Yükleniyor..." : "Ürünleri İçe Aktar"}
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Ürün","Seri","Fiyat","İndirimli Fiyat","Stok",""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({length: 8}).map((_,i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : items.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image||"/hero-bg.jpg"} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" onError={e => {(e.target as any).src="/hero-bg.jpg"}} />
                      <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{p.series}</span></td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">₺{parseFloat(p.price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-gray-400 line-through">₺{parseFloat(p.compareAtPrice||p.price).toFixed(2)}</td>
                  <td className="px-5 py-3"><span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Stokta</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => setEditPrice({ id: p.id, price: p.price, compare: p.compareAtPrice||p.price })}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                  Ürün bulunamadı. {data?.total === 0 && "Ürünleri içe aktarmak için butona tıklayın."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {editPrice && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditPrice(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-4">Fiyat Güncelle</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Satış Fiyatı (₺)</label>
                <input type="number" step="0.01" value={editPrice.price}
                  onChange={e => setEditPrice(p => p ? {...p, price: e.target.value} : null)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Karşılaştırma Fiyatı (₺)</label>
                <input type="number" step="0.01" value={editPrice.compare}
                  onChange={e => setEditPrice(p => p ? {...p, compare: e.target.value} : null)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditPrice(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">İptal</button>
              <button onClick={() => updatePrice.mutate({ id: editPrice.id, price: editPrice.price, compareAtPrice: editPrice.compare })}
                disabled={updatePrice.isPending}
                className="flex-1 py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:opacity-90">
                {updatePrice.isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CUSTOMERS ─── */
function CustomersPage() {
  const [search, setSearch] = useState("");
  const { data: customers = [], refetch } = trpc.admin.customers.useQuery();
  const setRole = trpc.admin.setRole.useMutation({ onSuccess: () => refetch() });

  const filtered = (customers as any[]).filter((c: any) =>
    !search || c.email.toLowerCase().includes(search.toLowerCase()) || (c.name||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
        <p className="text-gray-400 text-sm">{customers.length} kayıtlı kullanıcı</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="İsim veya e-posta ara..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Müşteri","E-posta","Kayıt Tarihi","Son Giriş","Rol",""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-bold">
                        {((c.name||c.email)||"?")[0].toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{c.name || "—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{c.email}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(c.lastSignInAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.role === "admin" ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-600"}`}>
                      {c.role === "admin" ? "Admin" : "Müşteri"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setRole.mutate({ userId: c.id, role: c.role === "admin" ? "user" : "admin" })}
                      className="text-xs text-gray-400 hover:text-[#1a1a2e] underline transition-colors">
                      {c.role === "admin" ? "Müşteri Yap" : "Admin Yap"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">Müşteri bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ─── MAIN ─── */
export default function AdminDashboard() {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
        <div className="w-14 h-14 bg-[#1a1a2e] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-black text-xl">C</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Giriş Yapın</h2>
        <p className="text-gray-400 text-sm mb-6">Admin paneline erişmek için giriş yapmanız gerekiyor.</p>
        <Link to="/login" className="block w-full py-3 bg-[#1a1a2e] text-white rounded-xl font-semibold text-sm text-center hover:opacity-90 transition-opacity">
          Giriş Yap
        </Link>
      </div>
    </div>
  );

  if (user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
        <XCircle size={48} className="mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h2>
        <p className="text-gray-400 text-sm mb-6">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        <Link to="/" className="block w-full py-3 bg-[#1a1a2e] text-white rounded-xl font-semibold text-sm text-center">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} user={user} logout={logout} />
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Admin</span><ChevronRight size={14} />
            <span className="text-gray-900 font-medium capitalize">
              {page === "dashboard" ? "Genel Bakış" : page === "orders" ? "Siparişler" : page === "products" ? "Ürünler" : "Müşteriler"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 relative">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-bold">
                {((user?.name || user?.email) || "A")[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name || user?.email}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {page === "dashboard" && <DashboardPage />}
          {page === "orders"    && <OrdersPage />}
          {page === "products"  && <ProductsPage />}
          {page === "customers" && <CustomersPage />}
        </div>
      </main>
    </div>
  );
}
