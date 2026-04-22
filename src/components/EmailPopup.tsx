import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [show, timeLeft]);

  if (!show) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="popup-overlay">
      <div className="popup-content animate-fade-in">
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"><X size={16} /></button>
        <h3 className="text-xl font-bold mb-2">E-posta listemize katılırsan</h3>
        <p className="text-3xl font-bold mb-4">10% İNDİRİM!</p>
        <p className="text-sm text-gray-500 mb-4">Özel teklifler ve son haberler için e-posta listemize katılın.</p>
        <div className="text-4xl font-bold font-mono mb-6">
          {String(minutes).padStart(2, "0")}<span className="text-lg">m</span> : {String(seconds).padStart(2, "0")}<span className="text-lg">s</span>
        </div>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg mb-3 text-sm" style={{ borderColor: "var(--color-border)" }} />
        <button className="btn-black mb-3">Katıl</button>
        <button onClick={() => setShow(false)} className="text-sm text-gray-400">Hayır, teşekkürler.</button>
      </div>
    </div>
  );
}
