"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Doctor } from "../types";

interface DoctorCardProps {
  doctor: Doctor;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onLikeDoctor: (doctorId: string) => void;
  isLiked?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onSelectDoctor,
  onBookDoctor,
  onLikeDoctor,
  isLiked = false,
}) => {
  const [animatingHeart, setAnimatingHeart] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingHeart(true);
    onLikeDoctor(doctor.id);
    setTimeout(() => setAnimatingHeart(false), 600);
  };

  const primaryPractice = doctor.practicePlaces[0];

  return (
    <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-brand-600 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Photo + Like Button + Badges */}
        <div className="flex items-start justify-between gap-3">
          {/* Avatar with Halo effect as in dasboar2.jpg */}
          <div className="relative">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-teal-50 shadow-md group-hover:ring-teal-100 transition-all">
              <Image
                src={doctor.photoUrl}
                alt={doctor.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Online/Active Green Dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          </div>

          {/* Like Button with counter */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isLiked
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200 hover:border-rose-200"
            }`}
            title="Sukai dokter ini"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400 group-hover:text-rose-400"
              } ${animatingHeart ? "scale-125 transition-transform" : ""}`}
            />
            <span>{doctor.likes}</span>
          </button>
        </div>

        {/* Doctor Info */}
        <div className="mt-4 text-left">
          {/* Category Pill */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              {doctor.category}
            </span>

            {/* SIP Expiry Alert Pill (PRD requirement: <90 days = Segera perpanjang) */}
            {doctor.sipDaysLeft <= 90 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Segera perpanjang
              </span>
            )}
          </div>

          {/* Doctor Name */}
          <h3
            onClick={() => onSelectDoctor(doctor)}
            className="mt-2 text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors cursor-pointer line-clamp-1"
          >
            {doctor.name}
          </h3>

          <p className="text-xs text-slate-500 font-medium line-clamp-1">
            {doctor.specialization}
          </p>

          {/* Primary Facility / Practice */}
          {primaryPractice && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="truncate">{primaryPractice.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pl-5">
                <span>Kec. {primaryPractice.district}</span>
                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {primaryPractice.type === "dinas" ? "Instansi Pemerintah" : "Praktik Pribadi"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onSelectDoctor(doctor)}
          className="flex-1 py-2 px-3 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all text-center"
        >
          Lihat Profil
        </button>

        <button
          onClick={() => onBookDoctor(doctor)}
          className="flex-1 py-2 px-3 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center gap-1"
        >
          <span>Konsultasi</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
export default DoctorCard;
