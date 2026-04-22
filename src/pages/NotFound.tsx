import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-xl font-bold mb-4">Sayfa Bulunamadı</h2>
        <p className="text-sm text-gray-400 mb-6">Aradığınız sayfa mevcut değil.</p>
        <Link to="/" className="btn-black">Ana Sayfaya Dön</Link>
      </div>
    </div>
  );
}
