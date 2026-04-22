import { Sparkles } from "lucide-react";

export default function CampaignBanner() {
  return (
    <section className="py-12 px-4">
      <div className="container-main">
        <div className="gradient-banner rounded-2xl py-12 px-6 sm:px-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={24} className="text-white" />
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Sınırlı Süre
              </span>
              <Sparkles size={24} className="text-white" />
            </div>
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
              Tüm Kılıflarda %50'ye Varan İndirim!
            </h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Özel tasarım telefon kılıflarında büyük indirim fırsatını kaçırma.
              Stoklarla sınırlı.
            </p>
            <button
              onClick={() => document.getElementById("bestseller")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: "white", color: "#1A1025" }}
            >
              Fırsatı Kaçırma
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
