"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  Globe,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenDoctorPortal: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenDoctorPortal,
  onOpenBooking,
}) => {
  return (
    <footer id="kontak" className="bg-[#1F2438] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              Ikatan Dokter Indonesia (IDI) Cabang Kabupaten Lombok Timur berdedikasi
              meningkatkan mutu pelayanan kesehatan, profesionalisme dokter, dan memudahkan
              masyarakat dalam mengakses informasi dokter terpercaya di seluruh Lombok Timur.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram IDI Lotim"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook IDI Lotim"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Website IDI Lotim"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beranda" className="hover:text-teal-400 transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-teal-400 transition-colors">
                  Departemen & Layanan
                </a>
              </li>
              <li>
                <a href="#direktori-dokter" className="hover:text-teal-400 transition-colors">
                  Cari Dokter Terdekat
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Konsultasi / Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Portal Internal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Portal Keanggotaan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDoctorPortal}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Portal Anggota Dokter</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5 text-purple-300"
                >
                  <span>Panel Admin & Iuran</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <span className="text-slate-500">Iuran Bulanan (Rp100.000/bln)</span>
              </li>
              <li>
                <span className="text-slate-500">Validasi SIP & STR</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Kontak Sekretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Sekretariat IDI Lotim
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Jl. Prof. M. Yamin No. 55, Selong, Kabupaten Lombok Timur, NTB 83612
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>(0376) 21118 / 0819-1765-4321</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>sekretariat@idilomboktimur.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Ikatan Dokter Indonesia (IDI) Cabang Kabupaten Lombok Timur. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Sistem Keanggotaan & Layanan Publik
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
