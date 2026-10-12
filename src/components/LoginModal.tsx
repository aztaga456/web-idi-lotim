"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Shield,
  UserCheck,
  Lock,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
} from "lucide-react";
import Logo from "./Logo";
import { Doctor, AuthUser } from "../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  doctors: Doctor[];
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenDashboard?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  doctors,
  currentUser,
  onLogout,
  onOpenDashboard,
}) => {
  const [roleTab, setRoleTab] = useState<"doctor" | "admin">("doctor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      setLoading(false);

      // 1. Check Admin Master credentials
      if (
        (cleanUser === "admin" && (cleanPass === "admin" || cleanPass === "1234" || cleanPass === "admin123")) ||
        (cleanUser === "pengurus" && cleanPass === "1234")
      ) {
        onLoginSuccess({
          id: "admin-master",
          username: cleanUser,
          name: "Pengurus IDI Cabang Lombok Timur",
          role: "admin",
        });
        onClose();
        return;
      }

      // 2. Check if doctor matches
      const doctor = doctors.find((d) => d.username.toLowerCase() === cleanUser);

      if (doctor) {
        if (doctor.password !== cleanPass) {
          setErrorMsg("Kata sandi salah. Silakan coba kembali (default: 1234).");
          return;
        }

        const isGrantedAdmin = doctor.role === "admin";
        if (roleTab === "admin" && !isGrantedAdmin) {
          setErrorMsg(
            `Akun '${doctor.name}' terdaftar sebagai Dokter Anggota (belum diberi akses Admin). Silakan pilih opsi 'Dokter Anggota' untuk masuk ke profil Anda.`
          );
          return;
        }

        const effectiveRole: "admin" | "doctor" =
          roleTab === "admin" && isGrantedAdmin ? "admin" : "doctor";

        onLoginSuccess({
          id: doctor.id,
          username: doctor.username,
          name: doctor.name,
          role: effectiveRole,
          doctorId: doctor.id,
        });
        onClose();
        return;
      }

      // 3. User not found
      setErrorMsg(
        roleTab === "admin"
          ? "Akun Pengurus Admin tidak ditemukan. Gunakan username 'admin' (password: 1234) atau pilih akun pengurus dari daftar cepat."
          : "Username dokter tidak ditemukan. Default username: 'dokter1' s/d 'dokter50'."
      );
    }, 250);
  };

  const setDemoCredentials = (u: string, p: string, r: "doctor" | "admin") => {
    setRoleTab(r);
    setUsername(u);
    setPassword(p);
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#F3F6FA] overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased text-slate-800 selection:bg-red-600 selection:text-white animate-in fade-in duration-200">
      {/* Decorative ambient background accents (Red, Black, White) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Login Card - NO Top Header, Standalone Card matching login form.jpg */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] animate-in zoom-in-95 duration-200">
        
        {/* Floating Close Button at top-right corner of card */}
        <button
          onClick={onClose}
          aria-label="Tutup form login"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Model Dokter Menghadap Kiri & Elemen Grafis Merah Hitam Putih */}
        <div className="lg:col-span-5 bg-[#FAFAFA] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden">
          
          {/* Top Left: Logo IDI matching login form.jpg top-left placement */}
          <div className="space-y-3 z-10">
            <div className="inline-block">
              <Logo size="md" variant="navbar" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[11px] font-bold text-red-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Portal Resmi IDI Lombok Timur</span>
            </div>
          </div>

          {/* Model Card Container: Red, Black, White gradient with Doctors facing LEFT */}
          <div className="relative my-6 sm:my-8 flex items-center justify-center">
            {/* The tall vertical rounded card container matching login form.jpg */}
            <div className="w-full h-80 sm:h-96 rounded-3xl sm:rounded-[2rem] bg-gradient-to-tr from-black via-[#991B1B] to-[#DC2626] relative overflow-hidden shadow-xl flex items-end justify-center border border-red-950/20">
              
              {/* Subtle decorative circles & grid dots */}
              <div className="absolute top-4 right-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-10 left-4 w-36 h-36 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Model 3 Dokter Hadap Kiri (Mirror / Flipped as requested) */}
              <div className="relative w-full h-[92%] flex items-end justify-center drop-shadow-2xl">
                <Image
                  src="/images/hero-3-doctors-flipped.png"
                  alt="Tim Dokter IDI Lombok Timur (Hadap Kiri)"
                  fill
                  priority
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Floating Badge 1 (Top Left) matching login form.jpg badge */}
            <div className="absolute -top-3 -left-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-2 text-[11px] font-bold text-slate-900 animate-in fade-in slide-in-from-top-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span>50+ Dokter Terdaftar</span>
            </div>

            {/* Floating Badge 2 (Bottom Right) matching login form.jpg badge */}
            <div className="absolute -bottom-3 -right-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
              <Shield className="w-3.5 h-3.5 text-red-600" />
              <span>100% STR & SIP Valid</span>
            </div>
          </div>

          {/* Left Footer Caption */}
          <div className="text-[11px] text-slate-400 text-center lg:text-left z-10">
            <p className="font-medium text-slate-500">
              Ikatan Dokter Indonesia Cabang Kab. Lombok Timur
            </p>
            <p>© 2026 Hak Cipta Dilindungi · Pelayanan Profesional Kesehatan</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Formulir Login Merah Hitam Putih matching login form.jpg */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center space-y-6">
          
          {/* Header Title on Right Form */}
          <div className="space-y-1.5 pr-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Portal Masuk Anggota
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Silakan masukkan kredensial akun dokter atau pengurus cabang Anda.
            </p>
          </div>

          {/* If already logged in: active session notice */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Sesi Aktif: {currentUser.name}
                  </p>
                  <p className="text-[11px] text-red-700 font-semibold">
                    {currentUser.role === "admin"
                      ? "Akses Pengurus Admin"
                      : `Dokter Anggota (${currentUser.username})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDashboard?.();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Buka Panel
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setUsername("");
                      setPassword("");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Role Radio Pills matching login form.jpg ("I am registering for: Myself / Other people") */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Masuk Sebagai:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setRoleTab("doctor")}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  roleTab === "doctor"
                    ? "border-red-600 bg-red-50/50 text-slate-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="loginRoleModal"
                  checked={roleTab === "doctor"}
                  onChange={() => setRoleTab("doctor")}
                  className="w-4 h-4 accent-red-600 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center gap-2">
                  <UserCheck className={`w-4 h-4 ${roleTab === "doctor" ? "text-red-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">Dokter Anggota</span>
                </div>
              </label>

              <label
                onClick={() => setRoleTab("admin")}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  roleTab === "admin"
                    ? "border-red-600 bg-red-50/50 text-slate-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="loginRoleModal"
                  checked={roleTab === "admin"}
                  onChange={() => setRoleTab("admin")}
                  className="w-4 h-4 accent-red-600 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${roleTab === "admin" ? "text-red-600" : "text-slate-400"}`} />
                  <span className="text-xs font-bold">Pengurus Admin</span>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Account Picker Dropdown */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Pilih Cepat Akun Dokter / Admin:</span>
              </span>
              <span className="text-[10px] text-slate-400">1-klik isi otomatis</span>
            </div>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (val === "admin") {
                  setDemoCredentials("admin", "1234", "admin");
                } else {
                  const doc = doctors.find((d) => d.username === val);
                  if (doc) {
                    setDemoCredentials(
                      doc.username,
                      doc.password,
                      doc.role === "admin" ? "admin" : "doctor"
                    );
                  }
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="">-- Pilih Akun Dokter atau Admin --</option>
              <option value="admin">★ Admin Master (Username: admin | Pass: 1234)</option>
              {doctors.slice(0, 15).map((doc) => (
                <option key={doc.id} value={doc.username}>
                  {doc.name} ({doc.username} | {doc.category})
                </option>
              ))}
            </select>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form Inputs */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input 1: Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Username / NPA IDI <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={roleTab === "admin" ? "admin" : "Contoh: dokter1"}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kata Sandi <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi (default: 1234)"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help Link */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 accent-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-slate-600 font-medium">Ingat Saya</span>
              </label>

              <a
                href="https://wa.me/6281917654321?text=Halo%20Sekretariat%20IDI%20Lombok%20Timur,%20saya%20butuh%20bantuan%20login%20akun."
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:text-red-800 font-bold hover:underline"
              >
                Lupa Password?
              </a>
            </div>

            {/* CTA Button: Red to Black gradient matching logo palette */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:to-zinc-900 text-white font-black text-sm shadow-xl shadow-red-600/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Portal IDI</span>
                  <span className="font-mono">→</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Navigation Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-700 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Publik</span>
            </button>

            <span className="text-slate-400">
              Butuh bantuan? Hubungi Sekretariat IDI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
