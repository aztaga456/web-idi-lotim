"use client";

import React from "react";
import {
  Stethoscope,
  Baby,
  Activity,
  HeartHandshake,
  Scissors,
  HeartPulse,
  Brain,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "../data/categories";

interface ServicesSectionProps {
  onSelectCategory: (categoryName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Stethoscope":
        return <Stethoscope className="w-6 h-6" />;
      case "Baby":
        return <Baby className="w-6 h-6" />;
      case "Activity":
        return <Activity className="w-6 h-6" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-6 h-6" />;
      case "Scissors":
        return <Scissors className="w-6 h-6" />;
      case "HeartPulse":
        return <HeartPulse className="w-6 h-6" />;
      case "Brain":
        return <Brain className="w-6 h-6" />;
      case "Eye":
        return <Eye className="w-6 h-6" />;
      default:
        return <Stethoscope className="w-6 h-6" />;
    }
  };

  const handleCardClick = (name: string) => {
    onSelectCategory(name);
    const element = document.getElementById("direktori-dokter");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="layanan" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800 mb-3">
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span>Pelayanan Medis Terintegrasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Departemen & Kategori Spesialisasi Dokter
          </h2>
          <p className="mt-3 text-base text-slate-600 font-normal">
            Daftar bidang spesialisasi yang dikelola oleh anggota IDI Lombok Timur,
            siap memberikan diagnosis dan tatalaksana medis berkualitas tinggi.
          </p>
        </div>

        {/* Categories Grid matching modern rounded aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.name)}
              className="group p-6 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {cat.count} Dokter
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat.shortName}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                <span>Lihat Dokter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* 4 Pillars of Excellence Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-teal-400">Resmi</div>
              <p className="text-sm font-bold text-white">Dokter Berkompeten</p>
              <p className="text-xs text-slate-400">Terdaftar resmi di database IDI</p>
            </div>
            <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">21</div>
              <p className="text-sm font-bold text-white">Kecamatan Lotim</p>
              <p className="text-xs text-slate-400">Jangkauan layanan merata di seluruh wilayah</p>
            </div>
            <div className="space-y-1 lg:border-l lg:border-white/10 lg:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <p className="text-sm font-bold text-white">Legalitas STR & SIP</p>
              <p className="text-xs text-slate-400">Tervalidasi aktif oleh dinas kesehatan</p>
            </div>
            <div className="space-y-1 lg:border-l lg:border-white/10 lg:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">24/7</div>
              <p className="text-sm font-bold text-white">Pusat Rujukan</p>
              <p className="text-xs text-slate-400">RSUD & Puskesmas siaga darurat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ServicesSection;
