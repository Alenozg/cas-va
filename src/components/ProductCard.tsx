import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export interface ProductCardData {
  id: string;
  title: string;
  series: string;
  price: number;
  compareAtPrice: number;
  image: string;
  badgeColor: string;
  models: string[];
}

interface ProductCardProps {
  product: ProductCardData;
  variant?: "default" | "compact";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      title: product.title,
      price: product.price,
      oldPrice: product.compareAtPrice,
      image: product.image || "/hero-bg.jpg",
      model: product.models?.[0] || "iPhone 15",
      quantity: 1,
      series: product.series,
    });
  };

  const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);

  if (variant === "compact") {
    return (
      <Link to={`/urun/${product.id}`} className="block">
        <div className="relative rounded-xl overflow-hidden mb-2" style={{ aspectRatio: "3/4", background: "#f5f5f5" }}>
          <img src={product.image || "/hero-bg.jpg"} alt={product.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
          <span className="product-badge">%{discount} İNDİRİM!</span>
        </div>
        <h3 className="text-[13px] font-medium leading-tight mb-1 line-clamp-2">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{product.price.toFixed(2)}TL</span>
          <span className="text-xs text-gray-400 line-through">{product.compareAtPrice.toFixed(2)}TL</span>
        </div>
        <button onClick={handleAdd} className="mt-2 w-full py-2.5 text-xs font-semibold border rounded-lg hover:bg-black hover:text-white transition-colors">Seçenekleri belirle</button>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-border)", background: "white" }}>
      <Link to={`/urun/${product.id}`} className="block">
        <div className="relative" style={{ aspectRatio: "4/5" }}>
          <img src={product.image || "/hero-bg.jpg"} alt={product.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/hero-bg.jpg"; }} />
          <span className="product-badge">%{discount} İNDİRİM!</span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/urun/${product.id}`}>
          <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold">{product.price.toFixed(2)} TL</span>
          <span className="text-sm text-gray-400 line-through">{product.compareAtPrice.toFixed(2)} TL</span>
        </div>
        <button onClick={handleAdd} className="btn-black-outline text-xs py-2.5">Seçenekleri belirle</button>
      </div>
    </div>
  );
}
