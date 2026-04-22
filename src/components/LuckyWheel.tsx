import { useState, useRef } from "react";
import { Gift } from "lucide-react";

const SEGMENTS = [
  { label: "%5 İndirim", color: "#EC4899" },
  { label: "Boş", color: "#374151" },
  { label: "%10 İndirim", color: "#F97316" },
  { label: "Kargo\nBedava", color: "#22C55E" },
  { label: "%30 İndirim", color: "#EAB308" },
  { label: "%20 İndirim", color: "#EF4444" },
  { label: "Boş", color: "#1E3A5F" },
  { label: "%15 İndirim", color: "#8B5CF6" },
];

export default function LuckyWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const extraSpins = 5 + Math.random() * 3;
    const segmentAngle = 360 / SEGMENTS.length;
    const randomSegment = Math.floor(Math.random() * SEGMENTS.length);
    const segmentOffset = randomSegment * segmentAngle + Math.random() * segmentAngle * 0.8 + segmentAngle * 0.1;
    const newRotation = rotation + extraSpins * 360 + segmentOffset;
    setRotation(newRotation);
    setTimeout(() => {
      setSpinning(false);
      const actualRotation = newRotation % 360;
      const winningIndex = Math.floor((360 - actualRotation + segmentAngle / 2) % 360 / segmentAngle) % SEGMENTS.length;
      setResult(SEGMENTS[winningIndex].label);
    }, 4200);
  };

  return (
    <section className="py-10 px-4" style={{ background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)" }}>
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: "rgba(245,158,11,0.2)", color: "#FCD34D" }}>
          <Gift size={12} /> ÖZEL KAMPANYA
        </span>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#FCD34D" }}>Şans Çarkı!</h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Çarkı çevir, bugünkü indirimini yakala</p>
      </div>

      <div className="wheel-container">
        <div className="wheel-pointer" />
        <div ref={wheelRef} className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * 360) / SEGMENTS.length;
              const endAngle = ((i + 1) * 360) / SEGMENTS.length;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              const midAngle = (startAngle + endAngle) / 2 - 90;
              const textRad = (midAngle * Math.PI) / 180;
              const tx = 50 + 32 * Math.cos(textRad);
              const ty = 50 + 32 * Math.sin(textRad);
              return (
                <g key={i}>
                  <path d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} fill={seg.color} stroke="#333" strokeWidth="0.5" />
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5" fontWeight="600">{seg.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="wheel-center" />
      </div>

      <div className="text-center mt-6">
        <button onClick={spin} disabled={spinning} className="btn-yellow" style={{ opacity: spinning ? 0.6 : 1 }}>
          ÇARKI ÇEVİR
        </button>
        <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>Şansını dene!</p>
      </div>

      {result && (
        <div className="text-center mt-4 p-4 rounded-xl animate-fade-in" style={{ background: "rgba(252,211,77,0.15)" }}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Tebrikler!</p>
          <p className="text-xl font-bold" style={{ color: "#FCD34D" }}>{result} Kazandın!</p>
        </div>
      )}
    </section>
  );
}
