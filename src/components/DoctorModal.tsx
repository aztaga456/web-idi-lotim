"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Heart,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award,
  Phone,
  Mail,
  ExternalLink,
  Share2,
  Globe,
  Instagram,
  CheckCircle,
} from "lucide-react";
import { Doctor } from "../types";

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookDoctor: (doctor: Doctor) => void;
  onLikeDoctor: (doctorId: string) => void;
  isLiked?: boolean;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onBookDoctor,
  onLikeDoctor,
  isLiked = false,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Modal Card matching dasboar2.jpg & profil.jpg aesthetic */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header Background Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-teal-600 via-sky-600 to-brand-700 relative flex items-start justify-end p-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 pt-0 -mt-14 sm:-mt-16 flex-1 space-y-6">
          {/* Avatar and Basic Header Information */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {/* Profile Photo matching dasboar2.jpg circular portrait with halo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-slate-100 shrink-0">
                <Image
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {doctor.category}
                  </span>

                  {/* SIP Expiry Alert */}
                  {doctor.sipDaysLeft <= 90 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      SIP Segera Perpanjang ({doctor.sipDaysLeft} hari)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      SIP Aktif
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {doctor.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {doctor.title} · {doctor.specialization}
                </p>
              </div>
            </div>

            {/* Like Counter & Booking CTA */}
            <div className="flex items-center gap-2 self-start sm:self-end">
              <button
                onClick={() => onLikeDoctor(doctor.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  isLiked
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
                <span>{doctor.likes} Suka</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookDoctor(doctor);
                }}
                className="px-5 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 shadow-md transition-all"
              >
                Konsultasi / Booking
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar matching profil.jpg (Experience, Rating, Views) */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Kunjungan Profil</p>
              <p className="text-lg font-black text-slate-800">{doctor.views}+</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Penggemar/Like</p>
              <p className="text-lg font-black text-rose-600">{doctor.likes}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Kecamatan Lotim</p>
              <p className="text-lg font-black text-teal-700">{doctor.district}</p>
            </div>
          </div>

          {/* Legalitas & Registrasi IDI (PRD Section 5.1 & 5.2) */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Legalitas & Data Keanggotaan IDI Lotim
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">NPA IDI:</span>
                <span className="font-semibold text-slate-800">{doctor.idiNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nomor STR:</span>
                <span className="font-semibold text-slate-800 font-mono text-[11px] truncate block">
                  {doctor.strNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Masa Berlaku SIP:</span>
                <span className="font-semibold text-slate-800">
                  {doctor.sipExpiryDate}
                </span>
              </div>
            </div>
          </div>

          {/* Bio Singkat */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Tentang Dokter</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Tempat Praktik & Jadwal (Multiple Places as required by PRD 5.2) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Tempat Praktik & Jadwal Pelayanan di Lombok Timur
            </h4>
            <div className="space-y-2.5">
              {doctor.practicePlaces.map((place, idx) => (
                <div
                  key={place.id || idx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-teal-300 transition-colors shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {place.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          place.type === "dinas"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {place.type === "dinas" ? "Fasilitas Dinas" : "Praktik Pribadi"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{place.address}</p>
                    <p className="text-xs font-medium text-teal-700 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {place.schedule}
                    </p>
                  </div>

                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 self-start sm:self-center transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Lihat Peta</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Galeri Tempat Praktik */}
          {doctor.gallery && doctor.gallery.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900">Galeri Fasilitas & Praktik</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {doctor.gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${doctor.name} - Galeri ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links matching dasboar2.jpg circular icon row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Media Sosial:</span>
              {doctor.socialLinks?.instagram && (
                <a
                  href={doctor.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {doctor.socialLinks?.website && (
                <a
                  href={doctor.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {doctor.socialLinks?.whatsapp && (
                <a
                  href={doctor.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={() => {
                onClose();
                onBookDoctor(doctor);
              }}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-600 via-sky-600 to-brand-600 hover:opacity-95 shadow-md"
            >
              Kirim Pesan / Booking Dokter Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DoctorModal;
