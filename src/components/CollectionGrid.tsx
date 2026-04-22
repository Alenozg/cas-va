import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = [
  {
    title: "Art Serisi",
    description: "Sanatsal ruhu yansıtan özel tasarımlar",
    image: "/products/casiva-mystic-lovers-eye-tasarim-telefon-kilifi-art-serisi.jpg",
    series: "Art",
    color: "#A78BFA",
  },
  {
    title: "Cute Serisi",
    description: "Sevimli, kawaii ve pastel temalı kılıflar",
    image: "/products/casiva-cozy-bear-love-tasarim-telefon-kilifi-cute-serisi.jpg",
    series: "Cute",
    color: "#F9A8D4",
  },
  {
    title: "Urban Serisi",
    description: "Şehir ve sokak stili temalı kılıflar",
    image: "/products/casiva-moto-queen-tasarim-telefon-kilifi-urban-serisi.jpg",
    series: "Urban",
    color: "#67E8F9",
  },
  {
    title: "Tüm Koleksiyonlar",
    description: "500+ özgün tasarımı keşfet",
    image: null,
    series: "",
    color: "",
    isAll: true,
  },
];

export default function CollectionGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".collection-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="seriler" ref={sectionRef} className="section-padding">
      <div className="container-main">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Öne Çıkan Koleksiyonlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.title}
              className="collection-card relative overflow-hidden rounded-2xl group cursor-pointer"
              style={{ height: 400 }}
            >
              {col.isAll ? (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #A78BFA 0%, #F9A8D4 50%, #67E8F9 100%)",
                    backgroundSize: "200% 200%",
                    animation: "gradientShift 10s ease infinite",
                  }}
                />
              ) : (
                <>
                  <img
                    src={col.image || "/hero-bg.jpg"}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "brightness(0.5)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${col.color}40 0%, transparent 60%)`,
                    }}
                  />
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {col.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  {col.description}
                </p>
                <Link
                  to={col.isAll ? "/#bestseller" : `/?series=${col.series}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all group/link"
                  style={{ color: col.isAll ? "#1A1025" : "#fff" }}
                >
                  Keşfet
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
