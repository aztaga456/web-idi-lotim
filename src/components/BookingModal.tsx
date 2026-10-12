"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  Send,
  CheckCircle,
  Phone,
  ShieldCheck,
  User,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Doctor } from "../types";
import { DISTRICTS } from "../data/districts";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
  doctors: Doctor[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedDoctor,
  doctors,
}) => {
  const [activeDoctorId, setActiveDoctorId] = useState(
    selectedDoctor?.id || doctors[0]?.id || ""
  );
  const [type, setType] = useState<"konsultasi" | "booking">("konsultasi");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Selong");
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [time, setTime] = useState("09:00");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentDoctor =
    doctors.find((d) => d.id === (selectedDoctor?.id || activeDoctorId)) ||
    doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    // Simulate submission as required by PRD 5.3
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setPatientName("");
    setPhone("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Modal card styled after login form.jpg reference */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 sm:p-14 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Permohonan {type === "konsultasi" ? "Konsultasi" : "Booking"} Terkirim!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Pesan telah diteruskan ke kotak pesan <strong>{currentDoctor?.name}</strong>.
                Admin / dokter akan segera mengonfirmasi jadwal Anda melalui WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-600">
              <p>
                <strong>Nama Pasien:</strong> {patientName}
              </p>
              <p>
                <strong>Nomor Kontak:</strong> {phone}
              </p>
              <p>
                <strong>Kecamatan:</strong> {district}
              </p>
              <p>
                <strong>Jadwal yang diminta:</strong> {date} pada pukul {time} WITA
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {currentDoctor?.phone && (
                <a
                  href={`https://wa.me/62${currentDoctor.phone.replace(/^0/, "")}?text=${encodeURIComponent(
                    `Halo ${currentDoctor.name}, saya ${patientName} dari Kec. ${district} ingin konfirmasi jadwal ${type} pada tanggal ${date}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Lanjut Chat via WhatsApp</span>
                </a>
              )}
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column matching login form.jpg visual: Doctor card with vibrant gradient background */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0284C7] via-[#0D9488] to-[#5B4FA8] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Subtle light circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Layanan Pasien Terpadu</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                  Konsultasi & Temu Janji Dokter Lotim
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Hubungkan keluhan kesehatan Anda dengan dokter ahli anggota IDI Lombok Timur
                  secara cepat, tepat, dan terkoordinasi.
                </p>
              </div>

              {/* Highlight Doctor Avatar & Trust Badges */}
              <div className="relative my-6 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/60 shrink-0">
                    <Image
                      src={currentDoctor.photoUrl}
                      alt={currentDoctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {currentDoctor.name}
                    </p>
                    <p className="text-[11px] text-teal-100">{currentDoctor.category}</p>
                    <p className="text-[10px] text-white/70">Kec. {currentDoctor.district}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-[10px] text-white/90">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                    <span>SIP Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>50+ Dokter IDI</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-white/75 relative">
                <p>
                  *Pengunjung tidak perlu registrasi akun. Cukup isi formulir singkat untuk melanjutkan.
                </p>
              </div>
            </div>

            {/* Right Column: Clean Form matching login form.jpg right layout */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Formulir Permintaan Konsultasi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi data singkat berikut untuk menjadwalkan konsultasi atau reservasi tempat praktik.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Consultation Type Selector (Radio/Pill style) */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setType("konsultasi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      type === "konsultasi"
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Konsultasi Pesan
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("booking")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      type === "booking"
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Booking Tempat Praktik
                  </button>
                </div>

                {/* Doctor Selection Dropdown */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Pilih Dokter Tujuan
                  </label>
                  <select
                    value={activeDoctorId}
                    onChange={(e) => setActiveDoctorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.category} ({d.district})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Patient Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Lengkap Pasien *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                </div>

                {/* Mobile / WhatsApp Number & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Nomor HP / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081912345678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Kecamatan Domisili *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      >
                        {DISTRICTS.map((dist) => (
                          <option key={dist.id} value={dist.name}>
                            Kec. {dist.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilihan Tanggal
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilihan Jam (WITA)
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                      <option value="08:30">08:30 WITA (Pagi)</option>
                      <option value="10:00">10:00 WITA (Pagi)</option>
                      <option value="13:30">13:30 WITA (Siang)</option>
                      <option value="16:30">16:30 WITA (Sore)</option>
                      <option value="19:00">19:00 WITA (Malam)</option>
                    </select>
                  </div>
                </div>

                {/* Message / Keluhan Singkat */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Keluhan Singkat / Catatan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan keluhan atau maksud konsultasi Anda..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-600 via-sky-600 to-brand-600 hover:from-teal-700 hover:to-brand-700 shadow-md shadow-teal-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Permohonan Sekarang</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingModal;
