import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Star, ChevronLeft, ChevronDown, ChevronUp, ShoppingCart, Check, Truck, Shield, RotateCcw, Package, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import Marquee from "@/components/Marquee";

interface RawProduct { id: string; title: string; series: string; description: string; price: number; compareAtPrice: number; image: string; badgeColor: string; models: string[]; tags: string[]; }

const ACCORDIONS = [
  { title: "Teknik Özellikler", content: "+54 farklı model ile tüm telefonlarınıza uygun tasarım. Modelini seç ve hemen siparişini ver! Telefon kılıfı; telefonunuza zarar vermeden korur, şık ve modern bir görünüm kazandırır." },
  { title: "Kutu İçeriği", content: "1 x Casiva Collection kılıf. Özenle hazırlanmış premium kutusu ile kapınıza teslim edilir." },
  { title: "Tak & Kullan", content: "Kılıfınızı telefonunuza takın ve hemen kullanmaya başlayın. Herhangi bir ek işlem gerektirmez." },
  { title: "Ürün Ölçüleri", content: "Kılıf kalınlığı: 1.2mm. Tam oturma garantili kesimler sayesinde kamera ve girişlere tam uyum." },
  { title: "Kargo ve Teslimat", content: "Siparişleriniz 1-3 iş günü içerisinde kargoya verilir. Tahmini teslimat süresi 3-5 iş günüdür. 950TL ve üzeri siparişlerde kargo ücretsizdir." },
  { title: "Taksit Seçenekleri", content: "Visa ve MasterCard ile 6 taksite kadar ödeme imkanı. PayTR güvencesi ile güvenli ödeme." },
  { title: "Kredi Kartı ile Güvenli Ödeme", content: "256-bit SSL sertifikası ile kredi kartı bilgileriniz şifrelenerek güvenli bir şekilde işlenir. PayTR altyapısı kullanılmaktadır." },
  { title: "İade Politikası", content: "14 gün içinde kullanılmamış ve ambalajı açılmamış ürünleri iade edebilirsiniz. İade kargo ücreti alıcıya aittir." },
];

const REVIEWS = [
  { name: "Ayşe Y.", date: "2 hafta önce", rating: 5, text: "Kılıf çok güzel, tam beklediğim gibi. Baskı kalitesi harika, rengi çok canlı. Kargo da hızlı geldi." },
  { name: "Mehmet K.", date: "1 ay önce", rating: 5, text: "Eşime hediye aldım, çok beğendi. Malzeme kalitesi çok iyi, telefonu tam koruyor." },
  { name: "Zeynep D.", date: "3 hafta önce", rating: 4, text: "Tasarım çok güzel ama biraz daha kalın olabilirdi. Genel olarak memnunum." },
];

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<RawProduct | null>(null);
  const [allProducts, setAllProducts] = useState<RawProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/products.json")
      .then((r) => r.json())
      .then((data: RawProduct[]) => {
        setAllProducts(data);
        const found = data.find((p) => p.id === handle);
        setProduct(found || null);
        if (found?.models?.length) setSelectedModel(found.models[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedModel) return;
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      title: product.title,
      price: product.price,
      oldPrice: product.compareAtPrice,
      image: product.image,
      model: selectedModel,
      quantity,
      series: product.series,
    });
  };

  const stripHtml = (html: string) => { const tmp = document.createElement("div"); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ""; };
  const related = allProducts.filter((p) => p.series === product?.series && p.id !== product?.id).slice(0, 4).map((p) => ({ id: p.id, title: p.title, series: p.series, price: p.price, compareAtPrice: p.compareAtPrice, image: p.image, badgeColor: p.badgeColor, models: p.models }));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-center"><h2 className="text-xl font-bold mb-4">Ürün Bulunamadı</h2><Link to="/" className="btn-black">Ana Sayfaya Dön</Link></div>;

  const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  const desc = stripHtml(product.description).slice(0, 150);

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 py-2 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-black">Ana sayfa</Link>
        <ChevronLeft size={12} className="rotate-180" />
        <span>{product.title}</span>
      </div>

      {/* Product Image */}
      <div className="px-4">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: "1/1" }}>
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
          <span className="product-badge">%{discount} İNDİRİM!</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold mb-1">{product.title}</h1>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i<=4?"#FCD34D":"none"} style={{ color: i<=4?"#FCD34D":"#ddd" }} />)}
          <span className="text-xs text-gray-400 ml-1">128 yorum</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold">{product.price.toFixed(2)}TL</span>
          <span className="text-sm text-gray-400 line-through">{product.compareAtPrice.toFixed(2)}TL</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#7C3AED", color: "white" }}>%{discount} İNDİRİM</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{desc}</p>

        {/* Model Selection */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Model Seçimi:</p>
          <div className="flex flex-wrap gap-2">
            {product.models?.map((m) => (
              <button key={m} onClick={() => setSelectedModel(m)} className={`chip ${selectedModel === m ? "active" : ""}`}>{m}</button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Adet:</span>
          <div className="flex items-center border rounded-lg" style={{ borderColor: "var(--color-border)" }}>
            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-2"><Minus size={14} /></button>
            <span className="px-4 py-2 text-sm font-semibold border-x" style={{ borderColor: "var(--color-border)" }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q+1)} className="px-3 py-2"><Plus size={14} /></button>
          </div>
        </div>

        {/* Add to Cart */}
        <button onClick={handleAddToCart} className="btn-black flex items-center justify-center gap-2 mb-4">
          <ShoppingCart size={18} /> SEPETE EKLE
        </button>

        {/* Shipping Timeline */}
        <div className="py-4">
          <h3 className="text-sm font-bold mb-3">Kargo Süreci</h3>
          <div className="flex items-center justify-between">
            {["Sipariş", "Baskı", "Kargolama", "Teslim"].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div className={`timeline-dot ${i <= 1 ? "active" : ""}`}>
                  {i <= 1 ? <Check size={14} /> : <Package size={14} />}
                </div>
                <span className="text-[10px] text-gray-500">{step}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 -mt-3">
            <div className="h-0.5 bg-black flex-1" />
            <div className="h-0.5 bg-black flex-1" />
            <div className="h-0.5 bg-gray-300 flex-1" />
          </div>
        </div>

        {/* Info Badges */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          {[{icon: Truck, label: "Hızlı Kargo"}, {icon: Shield, label: "Güvenli Alışveriş"}, {icon: RotateCcw, label: "14 Gün İade"}].map(({icon: Icon, label}) => (
            <div key={label} className="flex flex-col items-center gap-1 py-2"><Icon size={16} className="text-gray-600" /><span className="text-[10px] text-gray-500 text-center">{label}</span></div>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className="px-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        {ACCORDIONS.map((item, i) => (
          <div key={i} className="accordion-item">
            <div className="accordion-header" onClick={() => setOpenAccordion(openAccordion === i ? null : i)}>
              <span>{item.title}</span>
              {openAccordion === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <div className={`accordion-body ${openAccordion === i ? "open" : ""}`}>
              <div className="accordion-body-content">{item.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <section className="px-4 py-8 border-t" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="text-lg font-bold mb-4">Müşteri Yorumları</h3>
        <div className="space-y-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                <div><p className="text-sm font-medium">{r.name}</p><p className="text-[10px] text-gray-400">{r.date}</p></div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s<=r.rating?"#FCD34D":"none"} style={{ color: s<=r.rating?"#FCD34D":"#ddd" }} />)}
              </div>
              <p className="text-xs text-gray-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 py-8">
          <h3 className="text-lg font-bold mb-4">Bunları da beğenebilirsiniz</h3>
          <div className="grid grid-cols-2 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6 text-center text-xs text-gray-400">
        <p className="mb-1">Müşteri temsilcisi bilgi almak için:</p>
        <p className="text-white">casivacollection@gmail.com</p>
        <p className="mt-3">Erzurum Mah. Cad. 9129. Sk. No:4</p>
      </footer>
    </div>
  );
}
