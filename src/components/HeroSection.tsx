"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Search,
  ChevronDown,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Doctor } from "../types";
import { CATEGORIES } from "../data/categories";

interface HeroSectionProps {
  doctors: Doctor[];
  selectedCategory: string;
  selectedDoctor: string;
  onFilterChange: (category: string, doctorId: string, district?: string) => void;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  doctors,
  selectedCategory,
  selectedDoctor,
  onFilterChange,
  onOpenBooking,
}) => {
  const [department, setDepartment] = useState(selectedCategory || "");
  const [doctor, setDoctor] = useState(selectedDoctor || "");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSearchClick = () => {
    onFilterChange(department, doctor);
    const element = document.getElementById("direktori-dokter");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beranda" className="relative pt-6 pb-16 md:pb-24 overflow-hidden">
      {/* Outer rounded framing matching front end.jpg reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#E2EFF7] via-[#EBF3FA] to-[#DFECF6] border border-white/70 shadow-glass-lg p-6 sm:p-10 md:p-12 lg:p-16 overflow-hidden">
          {/* Subtle decorative background light elements */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-200/35 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-1/2 -right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Grid layout: Left Content & Right Doctor Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (matches typography and alignment of front end.jpg) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm text-xs font-semibold text-teal-800">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Portal Resmi IDI Cabang Kab. Lombok Timur</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Kesehatan Anda, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-700 to-brand-700">
                    Prioritas Kami
                  </span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
                Pelayanan kesehatan terpercaya dan penuh empati Ikatan Dokter Indonesia (IDI) Lombok Timur, siap melayani di 21 kecamatan.
              </p>

              {/* Fast Highlights Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/70">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>100% STR & SIP Terverifikasi</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/70">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>21 Kecamatan Terjangkau</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/70">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Jadwal Praktik Real-Time</span>
                </div>
              </div>
            </div>

            {/* Right Visual: 3 Dokter IDI Lombok Timur dengan elemen grafis modern (tanpa bayangan kotak, persis sesuai referensi) */}
            <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-end self-end">
              <div className="relative w-full max-w-lg sm:max-w-xl h-[380px] sm:h-[440px] lg:h-[520px] flex items-end justify-center lg:justify-end -mb-4 sm:-mb-6 lg:-mb-10">
                {/* 3 Doctors with background element (Transparent PNG, NO box shadow) */}
                <div className="relative w-full h-full flex items-end justify-center lg:justify-end pointer-events-none">
                  <Image
                    src="/images/hero-doctors-composite.png"
                    alt="3 Dokter IDI Cabang Lombok Timur dengan Elemen Grafis Medis"
                    fill
                    priority
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Frosted Glass Quick Finder Bar / Tabel Kolom Pencarian (sesuai referensi gambar) */}
          <div className="relative z-10 mt-6 sm:mt-8">
            <div className="backdrop-blur-xl bg-white/95 border border-white/90 shadow-glass-lg rounded-2xl sm:rounded-3xl p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                {/* Field 1: Department / Kategori */}
                <div className="space-y-1.5 text-left px-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white/90 border border-slate-200/80 rounded-2xl py-3 pl-3.5 pr-8 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">Semua Department / Spesialisasi</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} ({cat.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Field 2: Doctor */}
                <div className="space-y-1.5 text-left px-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Doctor
                  </label>
                  <div className="relative">
                    <select
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      className="w-full bg-white/90 border border-slate-200/80 rounded-2xl py-3 pl-3.5 pr-8 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">Pilih Dokter Spesialis / Umum</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} - {doc.category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Field 3: Date */}
                <div className="space-y-1.5 text-left px-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white/90 border border-slate-200/80 rounded-2xl py-2.5 px-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-sm cursor-pointer"
                    />
                  </div>
                </div>

                {/* Field 4: CTA Action Button matching Book Now teal pill */}
                <div className="pt-2 sm:pt-5 px-2">
                  <button
                    onClick={handleSearchClick}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0D9488] hover:from-[#0369A1] hover:to-[#0F766E] shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 transition-all transform active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>Book Now / Cari</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
