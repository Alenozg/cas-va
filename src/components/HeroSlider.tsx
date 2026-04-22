import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { image: "/products/casiva-mystic-lovers-eye-tasarim-telefon-kilifi-art-serisi.jpg", label: "Soyut Tasarımlar" },
  { image: "/products/casiva-helmet-kiss-tasarim-telefon-kilifi-urban-serisi.jpg", label: "Renkli Tasarımlar" },
  { image: "/products/casiva-angry-bunny-hug-tasarim-telefon-kilifi-cute-serisi.jpg", label: "Kedi Tasarımları" },
  { image: "/products/casiva-van-gogh-mosaic-tasarim-telefon-kilifi-art-serisi.jpg", label: "Sanatsal Tasarımlar" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1", maxHeight: 500 }}>
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-white/90 text-black px-6 py-3 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm">{slides[current].label}</span>
      </div>
      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><ChevronLeft size={16} /></button>
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><ChevronRight size={16} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
