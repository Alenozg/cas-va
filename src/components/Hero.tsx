import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.3)
      .fromTo(subtitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5)
      .fromTo(ctaRef.current, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.7)
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ marginTop: -72, paddingTop: 72 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(26,16,37,0.3) 0%, rgba(26,16,37,0.9) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 opacity-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Tarzını Koru,
          <br />
          <span className="text-gradient">Kendini İfade Et</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-0"
          style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
        >
          Özel tasarım telefon kılıflarıyla telefonunu bir sanat eserine dönüştür.
          500+ özgün tasarım arasından kendi stilini bul.
        </p>

        <Link
          ref={ctaRef}
          to="/#bestseller"
          className="inline-block btn-primary text-base px-10 py-4 opacity-0"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("bestseller")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Koleksiyonu Keşfet
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
      >
        <button
          onClick={() => document.getElementById("yeni")?.scrollIntoView({ behavior: "smooth" })}
          className="animate-bounce"
        >
          <ChevronDown size={28} style={{ color: "var(--text-muted)" }} />
        </button>
      </div>
    </section>
  );
}
