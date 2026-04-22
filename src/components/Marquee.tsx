export default function Marquee() {
  const items = ["3 AL 2 ÖDE!", "950TL ÜZERİ KARGO ÜCRETSİZ!", "5 AL 3 ÖDE!", "3 AL 2 ÖDE!", "950TL ÜZERİ KARGO ÜCRETSİZ!", "5 AL 3 ÖDE!"];
  return (
    <div className="bg-black text-white py-2.5 overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
