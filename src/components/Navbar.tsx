"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { LogIn, LogOut, Menu, X, Shield, UserCheck } from "lucide-react";
import { AuthUser } from "../types";

interface NavbarProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      {/* Floating Navbar Container: Only Brand, Nav Links, and ONLY Login at the end */}
      <nav className="backdrop-blur-xl bg-white/85 border border-white/70 shadow-glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center">
          <Logo size="md" variant="navbar" />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <a
            href="#beranda"
            className="text-teal-600 hover:text-teal-700 transition-colors"
          >
            Beranda
          </a>
          <a href="#layanan" className="hover:text-teal-600 transition-colors">
            Layanan
          </a>
          <a href="#spesialis" className="hover:text-teal-600 transition-colors">
            Kategori Spesialis
          </a>
          <a
            href="#direktori-dokter"
            className="hover:text-teal-600 transition-colors"
          >
            Dokter IDI
          </a>
          <a href="#berita" className="hover:text-teal-600 transition-colors">
            Berita & Jurnal
          </a>
          <a href="#kontak" className="hover:text-teal-600 transition-colors">
            Kontak
          </a>
        </div>

        {/* Di ujung pojok kanan atas HANYA tombol Login bersih (tanpa info user login di front-end) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:to-zinc-900 shadow-md shadow-red-600/25 hover:shadow-lg transition-all transform active:scale-95"
            aria-label="Login ke Sistem"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>

        {/* Mobile: Hamburger & Login */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:to-zinc-900 flex items-center gap-1.5 shadow-sm shadow-red-600/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl space-y-4 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2.5 font-medium text-slate-700 text-sm">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700 font-semibold"
            >
              Beranda
            </a>
            <a
              href="#layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700"
            >
              Layanan & Fasilitas
            </a>
            <a
              href="#spesialis"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700"
            >
              Kategori Spesialis
            </a>
            <a
              href="#direktori-dokter"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700"
            >
              Daftar Dokter IDI
            </a>
            <a
              href="#berita"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700"
            >
              Berita & Jurnal
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-700"
            >
              Kontak
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:to-zinc-900 flex items-center justify-center gap-2 shadow-sm shadow-red-600/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Login ke Sistem</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
