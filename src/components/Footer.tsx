import { Link } from "react-router";
import { Instagram, Twitter, Mail } from "lucide-react";

const COLLECTIONS = [
  { name: "Art Serisi", series: "Art" },
  { name: "Cute Serisi", series: "Cute" },
  { name: "Urban Serisi", series: "Urban" },
  { name: "Funny Serisi", series: "Funny" },
  { name: "Sports Serisi", series: "Sports" },
  { name: "Dark Serisi", series: "Dark" },
  { name: "Vintage Serisi", series: "Vintage" },
  { name: "Anime Serisi", series: "Anime" },
];

const HELP = [
  "Sıkça Sorulan Sorular",
  "Kargo ve Teslimat",
  "İade ve Değişim",
  "Gizlilik Politikası",
  "Kullanım Koşulları",
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "2px solid var(--primary)" }}>
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold italic mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              CASIVA
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Özel tasarım telefon kılıfları — Tarzını Koru. 500+ özgün tasarım
              ile telefonunu kişiselleştir.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Koleksiyonlar</h4>
            <ul className="space-y-2">
              {COLLECTIONS.map((col) => (
                <li key={col.series}>
                  <Link
                    to={`/?series=${col.series}`}
                    className="text-sm transition-colors hover:text-[var(--primary)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Yardım</h4>
            <ul className="space-y-2">
              {HELP.map((item) => (
                <li key={item}>
                  <span
                    className="text-sm cursor-default"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">İletişim</h4>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              destek@casiva.com.tr
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <Instagram size={18} style={{ color: "var(--text-secondary)" }} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <Twitter size={18} style={{ color: "var(--text-secondary)" }} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <Mail size={18} style={{ color: "var(--text-secondary)" }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-8 text-center text-sm"
          style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)" }}
        >
          © 2025 Casiva Collection. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
