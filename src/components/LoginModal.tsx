"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Shield,
  UserCheck,
  Lock,
  User,
  AlertCircle,
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
            `Akun '${doctor.name}' terdaftar sebagai Dokter Anggota. Pilih tab 'Dokter Anggota' untuk masuk.`
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
          ? "Akun Pengurus Admin tidak ditemukan. Gunakan username 'admin' (password: 1234)."
          : "Username dokter tidak ditemukan. Default: 'dokter1' s/d 'dokter50'."
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
    <div className="fixed inset-0 z-50 w-screen h-screen max-h-screen overflow-hidden flex items-center justify-center lg:justify-end px-4 sm:px-8 lg:px-14 xl:px-20 font-sans antialiased text-slate-800 selection:bg-red-600 selection:text-white animate-in fade-in duration-200">
      {/* FULLSCREEN 3D PIXAR BACKGROUND (3 Doctors on the Left) */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Image
          src="/images/login-pixar-bg.jpg"
          alt="Dokter IDI Lombok Timur Animasi 3D Pixar"
          fill
          priority
          className="object-cover object-center lg:object-left"
        />
        {/* Soft gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/40 pointer-events-none" />
      </div>

      {/* Floating Close Button at top-right of entire screen */}
      <button
        onClick={onClose}
        aria-label="Tutup form login"
        className="absolute top-5 right-5 z-40 p-2.5 rounded-full bg-white/90 hover:bg-red-50 text-slate-700 hover:text-red-600 backdrop-blur-md shadow-lg border border-white/80 transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* LEFT SIDE BRANDING MOTTO (Visible on desktop alongside 3D Pixar doctors) */}
      <div className="hidden lg:flex flex-col items-start absolute left-8 xl:left-14 bottom-8 xl:bottom-12 z-10 max-w-md pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/80 mb-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[11px] font-black text-slate-800 tracking-wider uppercase">
            Portal Resmi IDI Lombok Timur
          </span>
        </div>
        <h2 className="text-2xl xl:text-3xl font-black text-slate-900 drop-shadow-md leading-tight">
          Melayani Dengan Hati, <br />
          <span className="text-red-700">Menjaga Etika Profesi</span>
        </h2>
        <p className="text-xs font-semibold text-slate-700 drop-shadow-sm mt-1">
          Ikatan Dokter Indonesia Cabang Kabupaten Lombok Timur · NTB
        </p>
      </div>

      {/* RIGHT SIDE FLOATING LOGIN CARD (Sederhana, Fit, Tanpa Scroll) */}
      <div className="relative z-20 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/80 p-5 sm:p-7 flex flex-col justify-between my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top: Logo & Title Centered */}
        <div className="flex flex-col items-center text-center space-y-1 pb-1">
          <div className="inline-block mb-1">
            <Logo size="md" variant="navbar" />
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Portal Masuk Anggota
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            Ikatan Dokter Indonesia Cabang Lombok Timur
          </p>
        </div>

        {/* Active user session notice */}
        {currentUser && (
          <div className="my-2 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <span className="truncate font-bold text-slate-800 text-[11px]">
                {currentUser.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDashboard?.();
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700"
              >
                Panel
              </button>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setUsername("");
                    setPassword("");
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-[10px] hover:bg-slate-100"
                >
                  Keluar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl my-2">
          <button
            type="button"
            onClick={() => {
              setRoleTab("doctor");
              setErrorMsg("");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "doctor"
                ? "bg-white text-red-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dokter Anggota</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab("admin");
              setErrorMsg("");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "admin"
                ? "bg-white text-red-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Pengurus Admin</span>
          </button>
        </div>

        {/* Quick Autofill Selector */}
        <div className="mb-2">
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
            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">⚡ Pilih Cepat Akun Dokter / Admin</option>
            <option value="admin">★ Admin Master (admin / 1234)</option>
            {doctors.slice(0, 15).map((doc) => (
              <option key={doc.id} value={doc.username}>
                {doc.name} ({doc.username} | {doc.category})
              </option>
            ))}
          </select>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-2 p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form Fields */}
        <form onSubmit={handleLogin} className="space-y-2.5">
          {/* Username Input */}
          <div className="space-y-1">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username atau NPA IDI"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi akun"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Help Link */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-red-600 accent-red-600 focus:ring-red-500 border-slate-300"
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

          {/* Submit Button (Red-Black-White Palette) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:to-zinc-900 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </div>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <span className="font-mono">→</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Dismiss Link */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <span className="text-slate-400">Sekretariat IDI Lotim</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
