import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { ProductCardData } from "./ProductCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProductGridProps {
  title: string;
  id?: string;
  products: ProductCardData[];
  carousel?: boolean;
  loading?: boolean;
}

export default function ProductGrid({ title, id, products, carousel = false, loading = false }: ProductGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".product-card-wrapper");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
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
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const visibleProducts = carousel ? products : products.slice(0, visibleCount);

  if (loading) {
    return (
      <section id={id} className="section-padding">
        <div className="container-main flex items-center justify-center py-20">
          <Loader2 className="animate-spin" size={32} style={{ color: "var(--primary)" }} />
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={sectionRef} className="section-padding">
      <div className={carousel ? "px-4 sm:px-6 lg:px-8" : "container-main"}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>
          {carousel && (
            <div className="flex items-center gap-2">
              <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: "1px solid var(--border-subtle)" }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: "1px solid var(--border-subtle)" }}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {carousel ? (
          <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-card-wrapper flex-shrink-0" style={{ width: 280 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!carousel && products.length > visibleCount && (
          <div className="text-center mt-10">
            <button onClick={() => setVisibleCount((c) => c + 8)} className="btn-outline">
              Daha Fazla
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
