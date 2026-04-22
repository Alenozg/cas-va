import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const onSuccess = async () => {
    await utils.auth.me.invalidate();
    navigate("/");
  };

  const loginMutation = trpc.auth.login.useMutation({ onSuccess, onError: (e) => setError(e.message) });
  const registerMutation = trpc.auth.register.useMutation({ onSuccess, onError: (e) => setError(e.message) });

  const isPending = loginMutation.isPending || registerMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ email, password, name });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Üst bar */}
      <div className="px-4 py-4 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </Link>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Casiva</span>
        </Link>
      </div>

      {/* Form alanı */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Hoş Geldiniz" : "Hesap Oluştur"}
            </h1>
            <p className="text-gray-500 text-sm">
              {mode === "login"
                ? "Hesabınıza giriş yapın"
                : "Birkaç saniyede kayıt olun"}
            </p>
          </div>

          {/* Tab seçimi */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "login" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "register" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Hata mesajı */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Gönder butonu */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-black text-white text-sm font-bold rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 mt-2"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Giriş yapılıyor..." : "Kayıt olunuyor..."}
                </span>
              ) : (
                mode === "login" ? "Giriş Yap" : "Kayıt Ol"
              )}
            </button>
          </form>

          {/* Alt bilgi */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Devam ederek{" "}
            <span className="underline cursor-pointer">Gizlilik Politikası</span>'nı ve{" "}
            <span className="underline cursor-pointer">Kullanım Şartları</span>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
