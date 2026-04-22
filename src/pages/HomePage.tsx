import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Check, X, Shield, Star, Heart, CreditCard, RefreshCw, Users } from "lucide-react";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import HeroSlider from "@/components/HeroSlider";
import LuckyWheel from "@/components/LuckyWheel";
import EmailPopup from "@/components/EmailPopup";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

interface RawProduct { id: string; title: string; series: string; price: number; compareAtPrice: number; image: string; badgeColor: string; models: string[]; }

const COLLECTIONS = [
  { image: "/products/casiva-mystic-lovers-eye-tasarim-telefon-kilifi-art-serisi.jpg", name: "Soyut Tasarımlar" },
  { image: "/products/casiva-van-gogh-mosaic-tasarim-telefon-kilifi-art-serisi.jpg", name: "Animasyon Tasarımları" },
  { image: "/products/casiva-rebel-ariel-tasarim-telefon-kilifi-art-serisi.jpg", name: "Kolaj Tasarımları" },
  { image: "/products/casiva-cozy-bear-love-tasarim-telefon-kilifi-cute-serisi.jpg", name: "Feminine Tasarımlar" },
  { image: "/products/casiva-helmet-kiss-tasarim-telefon-kilifi-urban-serisi.jpg", name: "Couple Tasarımları" },
  { image: "/products/casiva-moto-queen-tasarim-telefon-kilifi-urban-serisi.jpg", name: "Dizi/Film Tasarımları" },
  { image: "/products/casiva-angry-bunny-hug-tasarim-telefon-kilifi-cute-serisi.jpg", name: "Vahşi Tasarımları" },
  { image: "/products/casiva-light-fury-eye-tasarim-telefon-kilifi-cute-serisi.jpg", name: "Mitology Tasarımları" },
  { image: "/products/casiva-dark-knight-shadow-tasarim-telefon-kilifi-dark-serisi.jpg", name: "Korku Tasarımları" },
  { image: "/products/casiva-pink-web-kitty-tasarim-telefon-kilifi-cute-serisi.jpg", name: "Anime Tasarımları" },
  { image: "/products/casiva-cloud-sink-dream-tasarim-telefon-kilifi-anime-serisi.jpg", name: "Sevimli Tasarımlar" },
  { image: "/products/casiva-retro-youth-world-tasarim-telefon-kilifi-vintage-serisi.jpg", name: "Renkli Tasarımlar" },
];

const COMPARISON = [
  { feature: "Estetik Tasarımlar", casiva: true, other: false },
  { feature: "Canlı Baskı Kalitesi", casiva: true, other: false },
  { feature: "Casiva Kalitesi", casiva: true, other: false },
  { feature: "Dayanıklılık", casiva: true, other: false },
];

const FEATURES = [
  { icon: Shield, title: "Premium Kalite Malzeme", desc: "Cihazınızı darbe ve çizilmelere karşı maksimum korur." },
  { icon: Star, title: "Baskı Kalitesi", desc: "Renk canlılığı ve dokusal kalite farkını hissedin." },
  { icon: Heart, title: "Binlerce Mutlu Müşteri", desc: "Müşterilerimiz, ürünümüzün kalitesinden çok memnun." },
  { icon: CreditCard, title: "Güvenli Ödeme", desc: "256-bit SSL ile güvenli ödeme imkanı." },
  { icon: RefreshCw, title: "Kolay İade & Değişim", desc: "14 gün içinde kolay iade ve değişim garantisi." },
];

function CollectionSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-8">
      <h2 className="section-title">TÜM KOLEKSİYONLAR</h2>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
        {COLLECTIONS.map((col, i) => (
          <div key={i} className="flex-shrink-0 w-[280px]">
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img src={col.image} alt={col.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-white text-sm font-medium">{col.name} →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useRef } from "react";

function ComparisonTable() {
  return (
    <section className="py-10 px-4 bg-gray-50">
      <h2 className="section-title mb-6">Neden Casiva Collection ?</h2>
      <div className="max-w-md mx-auto rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid grid-cols-3 text-center text-xs font-semibold py-3 bg-gray-100">
          <span></span>
          <span className="text-black">Casiva Collection</span>
          <span className="text-gray-400">Diğer Satıcılar</span>
        </div>
        {COMPARISON.map((row, i) => (
          <div key={i} className="grid grid-cols-3 text-center py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xs text-left pl-4">{row.feature}</span>
            <span className="flex justify-center">{row.casiva ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-500" />}</span>
            <span className="flex justify-center">{row.other ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-500" />}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesCarousel() {
  const [current, setCurrent] = useState(0);
  return (
    <section className="py-10 px-4">
      <h2 className="section-title mb-6">Casiva'dan Alışverişin Farkı</h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] snap-center p-5 rounded-xl border text-center" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center"><f.icon size={20} /></div>
              <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SatisfactionStats() {
  return (
    <section className="py-10 px-4 bg-gray-50">
      <h2 className="section-title mb-2">MÜŞTERİLERİMİZ NE DİYOR?</h2>
      <p className="text-center text-xs text-gray-500 mb-8">Casiva kullanıcılarının büyük çoğunluğu ürünlerimizin kalite, tasarım ve dayanıklılığından yüksek memnuniyet duydu.</p>
      <div className="flex justify-center gap-8 mb-6">
        {[92, 88, 95].map((pct, i) => (
          <div key={i} className="circular-progress">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#E5E5E5" strokeWidth="5" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="#000" strokeWidth="5" strokeDasharray={`${2 * Math.PI * 35 * pct / 100} ${2 * Math.PI * 35}`} strokeLinecap="round" />
            </svg>
            <span className="circular-progress-text">%{pct}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 max-w-sm mx-auto">
        {[
          "Kullanıcılarımız, Casiva'nın cihazlarını çok daha iyi koruduğunu belirtti.",
          "Kullanıcılarımız, ürünün baskı kalitesinin beklediklerinden çok daha canlı olduğunu söyledi.",
          "Kullanıcılarımız, süet iç yüzeyin premium bir his verdiğini ifade etti.",
        ].map((text, i) => (
          <div key={i} className="flex gap-3 text-xs text-gray-600">
            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">⭐ 4.9 / 5 ortalama değerlendirme - 1000+ memnun müşteri</p>
    </section>
  );
}

function CustomerPhotos() {
  return (
    <section className="py-8">
      <h2 className="section-title mb-4">SİZDEN GELENLER</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4">
        {["/products/casiva-mystic-lovers-eye-tasarim-telefon-kilifi-art-serisi.jpg", "/products/casiva-helmet-kiss-tasarim-telefon-kilifi-urban-serisi.jpg",
          "/products/casiva-cozy-bear-love-tasarim-telefon-kilifi-cute-serisi.jpg", "/products/casiva-angry-bunny-hug-tasarim-telefon-kilifi-cute-serisi.jpg"].map((img, i) => (
          <div key={i} className="flex-shrink-0 w-[160px] rounded-xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-10 px-4 bg-gray-50">
      <h2 className="section-title mb-6">İLETİŞİM</h2>
      <div className="max-w-md mx-auto space-y-3">
        <input placeholder="Ad" className="w-full px-4 py-3 border rounded-lg text-sm" style={{ borderColor: "var(--color-border)" }} />
        <input placeholder="E-posta" type="email" className="w-full px-4 py-3 border rounded-lg text-sm" style={{ borderColor: "var(--color-border)" }} />
        <input placeholder="Telefon numarası" className="w-full px-4 py-3 border rounded-lg text-sm" style={{ borderColor: "var(--color-border)" }} />
        <textarea placeholder="Yorum" rows={3} className="w-full px-4 py-3 border rounded-lg text-sm resize-none" style={{ borderColor: "var(--color-border)" }} />
        <button className="btn-black">Gönder</button>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section className="py-10 px-4 text-center">
      <h2 className="section-title mb-6">INSTAGRAM HESABIMIZ</h2>
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-pink-500 p-0.5">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">Casiva</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">@casivacollection</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold mb-3">Ana Menü</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {["Ana sayfa", "Koleksiyonlar", "İletişim", "Baskı ve Kargo Süreci"].map((item) => (
                <li key={item}><Link to="/" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Politikalar</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {["Gizlilik Politikası", "Mesafeli Satış Sözleşmesi", "Tüketici Hakları", "Çayma - İptal İade"].map((item) => (
                <li key={item}><span className="hover:text-white transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-gray-400">
          <p className="mb-1">Müşteri temsilcisi bilgi almak için:</p>
          <p className="mb-1">casivacollection@gmail.com</p>
          <p className="mb-1">casivacollection@hotmail.com</p>
          <p className="mt-3 text-gray-500">Erzurum Mah. Cad. 9129. Sk. No:4</p>
        </div>
      </div>
    </footer>
  );
}

function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="scroll-top">
      <ChevronLeft size={20} className="rotate-90" />
    </button>
  );
}

function FloatingButton() {
  return (
    <button className="floating-action">
      <Users size={22} />
    </button>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data: RawProduct[]) => {
        setProducts(data.map((p) => ({ ...p, models: p.models || [] })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const bestSellers = products.slice(0, 8);
  const related = products.slice(8, 16);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <Header />
      <HeroSlider />
      <EmailPopup />
      <LuckyWheel />

      {/* Best Sellers */}
      <section className="py-8 px-4">
        <h2 className="section-title mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>CASIVA &bull; ÇOK SATANLAR</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          {bestSellers.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[260px] snap-center">
              <ProductCard product={p} variant="compact" />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {bestSellers.slice(0, 5).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-black" : "bg-gray-300"}`} />
          ))}
        </div>
      </section>

      <CustomerPhotos />
      <CollectionSlider />
      <ComparisonTable />
      <FeaturesCarousel />
      <SatisfactionStats />
      <ContactSection />
      <InstagramSection />
      <Footer />
      <ScrollTop />
      <FloatingButton />
    </div>
  );
}
