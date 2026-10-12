"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Stethoscope,
  Filter,
  RotateCcw,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Doctor } from "../types";
import { DISTRICTS } from "../data/districts";
import { CATEGORIES } from "../data/categories";
import DoctorCard from "./DoctorCard";

interface DoctorDirectoryProps {
  doctors: Doctor[];
  selectedCategory: string;
  selectedDoctorId: string;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onLikeDoctor: (doctorId: string) => void;
  likedDoctorIds: string[];
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  selectedCategory,
  selectedDoctorId,
  onSelectDoctor,
  onBookDoctor,
  onLikeDoctor,
  likedDoctorIds,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "Semua");
  const [activeDistrict, setActiveDistrict] = useState("Semua");
  const [sortBy, setSortBy] = useState<"likes" | "name" | "district">("likes");

  // Automatically expand if a category or specific doctor filter is selected from outside
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "Semua") {
      setActiveCategory(selectedCategory);
      setIsExpanded(true);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedDoctorId) {
      setIsExpanded(true);
    }
  }, [selectedDoctorId]);

  // Featured doctors for continuous marquee showcase
  const marqueeDoctors = useMemo(() => {
    // Pick first 12 doctors sorted by likes
    return [...doctors].sort((a, b) => b.likes - a.likes).slice(0, 12);
  }, [doctors]);

  // Filtered and sorted doctors for the full directory
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          !query ||
          doc.name.toLowerCase().includes(query) ||
          doc.specialization.toLowerCase().includes(query) ||
          doc.district.toLowerCase().includes(query) ||
          doc.practicePlaces.some((p) => p.name.toLowerCase().includes(query));

        const matchesCategory =
          activeCategory === "Semua" || doc.category === activeCategory;

        const matchesDistrict =
          activeDistrict === "Semua" ||
          doc.district.toLowerCase() === activeDistrict.toLowerCase() ||
          doc.practicePlaces.some(
            (p) => p.district.toLowerCase() === activeDistrict.toLowerCase()
          );

        return matchesQuery && matchesCategory && matchesDistrict;
      })
      .sort((a, b) => {
        if (sortBy === "likes") {
          return b.likes - a.likes;
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else {
          return a.district.localeCompare(b.district);
        }
      });
  }, [doctors, searchQuery, activeCategory, activeDistrict, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("Semua");
    setActiveDistrict("Semua");
    setSortBy("likes");
  };

  return (
    <section id="direktori-dokter" className="py-16 md:py-24 bg-[#F4F8FC] scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 mb-3">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Direktori Terpadu Anggota IDI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Temukan Dokter Terdekat di Lombok Timur
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Daftar dokter spesialis dan umum terverifikasi IDI di 21 kecamatan, lengkap dengan jadwal praktik dan legalitas SIP aktif.
          </p>
        </div>

        {/* 1. CONTINUOUS MOTION SECTION (Motion bergeser kontinyu) */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Subtle Left & Right Gradient Fog Mask */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#F4F8FC] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#F4F8FC] to-transparent z-10" />

          {/* Continuous Infinite Marquee Row */}
          <div className="animate-marquee-continuous flex py-2 cursor-pointer">
            {marqueeDoctors.map((doc, idx) => (
              <div
                key={`marquee-1-${doc.id}-${idx}`}
                className="w-[280px] sm:w-[310px] shrink-0 mx-2.5 sm:mx-3 transition-transform hover:scale-102"
              >
                <DoctorCard
                  doctor={doc}
                  onSelectDoctor={onSelectDoctor}
                  onBookDoctor={onBookDoctor}
                  onLikeDoctor={onLikeDoctor}
                  isLiked={likedDoctorIds.includes(doc.id)}
                />
              </div>
            ))}
            {marqueeDoctors.map((doc, idx) => (
              <div
                key={`marquee-2-${doc.id}-${idx}`}
                className="w-[280px] sm:w-[310px] shrink-0 mx-2.5 sm:mx-3 transition-transform hover:scale-102"
              >
                <DoctorCard
                  doctor={doc}
                  onSelectDoctor={onSelectDoctor}
                  onBookDoctor={onBookDoctor}
                  onLikeDoctor={onLikeDoctor}
                  isLiked={likedDoctorIds.includes(doc.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. TOMBOL LIHAT SELENGKAPNYA (Di bawah section tampilan dokter) */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-teal-600 via-teal-700 to-sky-700 hover:from-teal-700 hover:to-sky-800 shadow-lg shadow-teal-600/25 hover:shadow-xl transition-all transform active:scale-95"
          >
            <span>
              {isExpanded
                ? "Tampilkan Lebih Sedikit"
                : `Lihat Selengkapnya (${doctors.length} Dokter IDI)`}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            />
          </button>
          <p className="mt-2 text-[11px] text-slate-500">
            {isExpanded
              ? "Klik untuk meringkas tampilan direktori"
              : "Buka pencarian lengkap berdasarkan 21 kecamatan & spesialisasi"}
          </p>
        </div>

        {/* 3. EXPANDABLE FULL DIRECTORY & SEARCH FILTERS */}
        {isExpanded && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Filter & Search Bar Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-glass space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                {/* Search Input */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama dokter, spesialisasi, atau rumah sakit..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* District Dropdown (21 districts) */}
                <div className="md:col-span-4 relative">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 top-3" />
                    <select
                      value={activeDistrict}
                      onChange={(e) => setActiveDistrict(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                    >
                      <option value="Semua">Semua Kecamatan di Lotim (21)</option>
                      {DISTRICTS.map((dist) => (
                        <option key={dist.id} value={dist.name}>
                          Kec. {dist.name} ({dist.doctorCount} Dokter)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Selector */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                  >
                    <option value="likes">Urutkan: Paling Disukai</option>
                    <option value="name">Urutkan: Nama (A-Z)</option>
                    <option value="district">Urutkan: Kecamatan</option>
                  </select>

                  {(searchQuery || activeCategory !== "Semua" || activeDistrict !== "Semua") && (
                    <button
                      onClick={resetFilters}
                      title="Reset Filter"
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Category Filter Pills */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Kategori:
                </span>

                <button
                  onClick={() => setActiveCategory("Semua")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === "Semua"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  Semua ({doctors.length})
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat.name
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                    }`}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Count Summary */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <p>
                Menampilkan <strong className="text-slate-800">{filteredDoctors.length}</strong> dokter anggota IDI
                {activeDistrict !== "Semua" && ` di Kec. ${activeDistrict}`}
                {activeCategory !== "Semua" && ` kategori ${activeCategory}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Semua data terverifikasi IDI Lotim</span>
              </div>
            </div>

            {/* Full Doctor Grid */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={`grid-${doc.id}`}
                    doctor={doc}
                    onSelectDoctor={onSelectDoctor}
                    onBookDoctor={onBookDoctor}
                    onLikeDoctor={onLikeDoctor}
                    isLiked={likedDoctorIds.includes(doc.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Dokter Tidak Ditemukan</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Tidak ada dokter yang cocok dengan kriteria pencarian Anda di kecamatan atau spesialisasi ini.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-full text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDirectory;
