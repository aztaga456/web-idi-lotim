"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Bell,
  Heart,
  Eye,
  CreditCard,
  MapPin,
  Settings,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Camera,
  CheckCircle,
  Plus,
  Edit3,
  KeyRound,
  User,
  Lock,
  ArrowLeft,
  Search,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
  ChevronRight,
  LogOut,
  Send,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Maximize2,
} from "lucide-react";
import { Doctor } from "../types";
import Logo from "./Logo";

interface DoctorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onSaveProfile?: (updatedDoctor: Doctor) => void;
  onLogout?: () => void;
}

export const DoctorPortalModal: React.FC<DoctorPortalModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSaveProfile,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "practice" | "legalitas" | "messages" | "dues" | "gallery"
  >("profile");

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(doctor.bio);
  const [phone, setPhone] = useState(doctor.phone);
  const [specialization, setSpecialization] = useState(doctor.specialization);
  const [username, setUsername] = useState(doctor.username);
  const [password, setPassword] = useState(doctor.password);
  const [confirmPassword, setConfirmPassword] = useState(doctor.password);
  const [photoUrl, setPhotoUrl] = useState(doctor.photoUrl);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [accountSaveSuccess, setAccountSaveSuccess] = useState(false);
  const [accountError, setAccountError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever doctor changes (ensures multi-user switches render immediately)
  useEffect(() => {
    setBio(doctor.bio);
    setPhone(doctor.phone);
    setSpecialization(doctor.specialization);
    setUsername(doctor.username);
    setPassword(doctor.password);
    setConfirmPassword(doctor.password);
    setPhotoUrl(doctor.photoUrl);
  }, [doctor]);

  // Handle upload / change photo from internal storage
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Format file harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = document.createElement("img");
      img.onload = () => {
        // Compress & scale to max 600x600 for optimal quality and small base64 footprint
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

          setPhotoUrl(compressedDataUrl);
          setIsUploadingPhoto(false);
          setPhotoSuccess(true);
          setTimeout(() => setPhotoSuccess(false), 3500);

          // Save immediately to doctor profile
          const updated: Doctor = {
            ...doctor,
            photoUrl: compressedDataUrl,
          };
          if (onSaveProfile) {
            onSaveProfile(updated);
          }
        }
      };
      img.onerror = () => {
        setIsUploadingPhoto(false);
        setPhotoError("Gagal memproses gambar. Silakan coba file lain.");
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
      setPhotoError("Gagal membaca file dari penyimpanan internal.");
    };
    reader.readAsDataURL(file);

    // Reset input so selecting the same file again works
    e.target.value = "";
  };

  // Gallery state for doctor member photos
  const [gallery, setGallery] = useState<string[]>(doctor.gallery || []);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [gallerySuccess, setGallerySuccess] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync gallery when doctor prop updates
  useEffect(() => {
    setGallery(doctor.gallery || []);
  }, [doctor.gallery]);

  // Handle uploading multiple photos to gallery from internal storage
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setGalleryError("");

    const newImages: string[] = [];
    const fileList = Array.from(files);

    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          reject("File bukan gambar");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const maxDim = 800;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.82));
            } else {
              reject("Gagal memproses gambar");
            }
          };
          img.onerror = () => reject("Gagal memuat gambar");
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject("Gagal membaca file");
        reader.readAsDataURL(file);
      });
    };

    try {
      for (const file of fileList) {
        try {
          const compressed = await processFile(file);
          newImages.push(compressed);
        } catch (err) {
          console.error(err);
        }
      }

      if (newImages.length > 0) {
        const updatedGallery = [...(doctor.gallery || []), ...newImages];
        setGallery(updatedGallery);
        const updatedDoc: Doctor = {
          ...doctor,
          gallery: updatedGallery,
        };
        if (onSaveProfile) {
          onSaveProfile(updatedDoc);
        }
        setGallerySuccess(true);
        setTimeout(() => setGallerySuccess(false), 3000);
      }
    } catch (err) {
      setGalleryError("Terjadi kendala saat memproses gambar.");
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  // Delete single photo from gallery
  const handleDeleteGalleryPhoto = (indexToDelete: number) => {
    if (!confirm("Hapus foto ini dari galeri profil Anda?")) return;
    const current = doctor.gallery || [];
    const updatedGallery = current.filter((_, idx) => idx !== indexToDelete);
    setGallery(updatedGallery);
    const updatedDoc: Doctor = {
      ...doctor,
      gallery: updatedGallery,
    };
    if (onSaveProfile) {
      onSaveProfile(updatedDoc);
    }
  };

  // Simulated incoming messages from patients
  const [messages] = useState([
    {
      id: "msg-1",
      sender: "H. Supardi",
      phone: "081917123987",
      district: "Selong",
      type: "Booking Tempat",
      date: "Besok (14:00 WITA)",
      content: "Mohon konfirmasi ketersediaan jadwal konsultasi anak saya demam 3 hari.",
      status: "baru",
    },
    {
      id: "msg-2",
      sender: "Ibu Nurhasanah",
      phone: "087865123999",
      district: "Aikmel",
      type: "Konsultasi Pesan",
      date: "Kemarin",
      content: "Apakah dokter praktik di RSUD Selong pada hari Rabu pagi?",
      status: "selesai",
    },
  ]);

  if (!isOpen) return null;

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Doctor = {
      ...doctor,
      bio,
      phone,
      specialization,
      photoUrl: photoUrl || doctor.photoUrl,
      username: username.trim() || doctor.username,
      password: password.trim() || doctor.password,
    };
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Handle Account Credentials Change (Username & Password)
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError("");

    if (!username.trim()) {
      setAccountError("Username tidak boleh kosong.");
      return;
    }
    if (password.length < 3) {
      setAccountError("Password minimal 3 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setAccountError("Konfirmasi password tidak cocok dengan password baru.");
      return;
    }

    const updated: Doctor = {
      ...doctor,
      username: username.trim(),
      password: password.trim(),
    };
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    setAccountSaveSuccess(true);
    setTimeout(() => setAccountSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#E8EEF7] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      {/* 1. Left Sidebar: Signature Deep Royal Purple (#5B4FA8) matching profil2.jpg */}
      <aside className="w-full md:w-64 bg-[#5B4FA8] text-white p-5 flex flex-col justify-between shrink-0 shadow-xl h-full overflow-y-auto">
        <div className="space-y-6">
          {/* Logo IDI with Circular Emblem */}
          <div className="pb-4 border-b border-purple-400/20">
            <Logo variant="white" size="sm" />
          </div>

          {/* Navigation Links matching profil2.jpg */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "profile"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profil Dokter</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "account"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4" />
                <span>Pengaturan Akun</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("practice")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "practice"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Tempat & Jadwal</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-900/40 text-purple-200">
                {doctor.practicePlaces.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("legalitas")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "legalitas"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Legalitas STR & SIP</span>
              </div>
              {doctor.sipDaysLeft <= 90 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                  !
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "messages"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Pesan Konsultasi</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-400 text-teal-950 font-bold">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("dues")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "dues"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Status Iuran</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  doctor.duesStatus === "lunas"
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-rose-400 text-rose-950"
                }`}
              >
                {doctor.duesStatus === "lunas" ? "Lunas" : "Tunggakan"}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                activeTab === "gallery"
                  ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>Galeri Foto Praktik</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-400 text-teal-950 font-bold">
                {doctor.gallery?.length || 0}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom of Sidebar: Navigation Action Buttons */}
        <div className="pt-6 space-y-4">
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-rose-500/25 hover:bg-rose-500/40 text-rose-100 hover:text-white text-xs font-bold transition-all border border-rose-400/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun ({doctor.username})</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Main Right Area: Full-screen background (#E8EEF7) matching profil2.jpg */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-[#E8EEF7]">
        {/* Top Header Bar matching profil2.jpg */}
        <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {activeTab === "profile" && "Profil Dokter"}
              {activeTab === "account" && "Pengaturan Akun (Username & Password)"}
              {activeTab === "practice" && "Tempat & Jadwal Praktik"}
              {activeTab === "legalitas" && "Legalitas STR & SIP"}
              {activeTab === "messages" && "Pesan Masuk Konsultasi Pasien"}
              {activeTab === "dues" && "Informasi Iuran Keanggotaan"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Portal Keanggotaan IDI Cabang Lombok Timur · NTB
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Pill matching profil2.jpg */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Cari informasi..."
                className="w-48 lg:w-64 pl-4 pr-10 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4FA8]/30"
              />
              <button className="w-7 h-7 rounded-full bg-[#5B4FA8] text-white absolute right-1.5 top-1.5 flex items-center justify-center shadow-sm">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exit Button matching profil2.jpg top-right logout icon */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm border border-slate-200/80"
              title="Keluar dari Profil"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {photoSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Foto profil berhasil diperbarui dari penyimpanan internal!</span>
            </div>
          )}

          {photoError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pembaruan profil dokter berhasil disimpan!</span>
            </div>
          )}

          {accountSaveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Username dan Password baru berhasil disimpan! Gunakan kredensial baru ini untuk login berikutnya.</span>
            </div>
          )}

          {/* TAB 1: PROFIL DOKTER (4-CARD GRID IDENTICAL TO profil2.jpg) */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Card 1 (Top Left, 8 cols): Profile Overview matching profil2.jpg */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 relative">
                {/* Edit Button at top right of card matching profil2.jpg */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-[#5B4FA8] hover:bg-purple-50 transition-colors"
                  title="Edit profil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Hidden file input for internal storage photo upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  {/* Avatar with Circular Purple Halo Ring matching profil2.jpg */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2 bg-gradient-to-tr from-[#5B4FA8] via-[#7B68EE] to-purple-300 flex items-center justify-center shadow-lg">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-white">
                          <Image
                            src={photoUrl || doctor.photoUrl}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Camera Button directly on Avatar */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#5B4FA8] hover:bg-purple-800 text-white flex items-center justify-center shadow-md border-2 border-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                        title="Upload / Ganti foto dari penyimpanan internal (PC / HP)"
                      >
                        {isUploadingPhoto ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {doctor.role === "admin" && (
                      <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5B4FA8] text-white shadow">
                        Admin
                      </span>
                    )}

                    {/* Dedicated Button under Avatar for maximum clarity */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B4FA8] hover:text-purple-900 text-[11px] font-bold border border-purple-200 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? "Memproses..." : "Ganti Foto"}</span>
                    </button>
                  </div>

                  {/* Doctor Info Rows */}
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {doctor.title} · {doctor.category}
                    </p>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600">
                      <p>
                        <span className="text-slate-400 font-medium">Tanggal Registrasi:</span>{" "}
                        <strong className="text-slate-800">24 November 2022</strong>
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">Wilayah:</span>{" "}
                        <strong className="text-slate-800">Kec. {doctor.district}, Lombok Timur</strong>
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">NPA IDI:</span>{" "}
                        <strong className="font-mono text-purple-700">{doctor.idiNumber}</strong>
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">No. STR:</span>{" "}
                        <strong className="font-mono text-slate-800">{doctor.strNumber}</strong>
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">E-mail:</span>{" "}
                        <strong className="text-slate-800">{doctor.email}</strong>
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">Telepon / WhatsApp:</span>{" "}
                        <strong className="text-slate-800">{doctor.phone}</strong>
                      </p>
                    </div>

                    {/* Contact Badges matching social icons on profil2.jpg */}
                    <div className="pt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <a
                        href={`https://wa.me/62${doctor.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200"
                        title="Chat WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`mailto:${doctor.email}`}
                        className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors border border-sky-200"
                        title="Kirim Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-[#5B4FA8] font-bold text-[11px] border border-purple-200">
                        {doctor.specialization}
                      </span>
                    </div>

                    {/* Fitur Love & Jumlah Kunjungan Profil Pasien & Galeri */}
                    <div className="pt-3.5 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold shadow-sm">
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span>{doctor.likes} Love / Disukai Pasien</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold shadow-sm">
                        <Eye className="w-4 h-4 text-sky-600" />
                        <span>{doctor.views} Kunjungan Profil</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("gallery")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B4FA8] text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>{(doctor.gallery || []).length} Foto Galeri (Kelola)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Edit Form when editing */}
                {isEditing && (
                  <form
                    onSubmit={handleSaveProfile}
                    className="mt-6 pt-6 border-t border-slate-100 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Keahlian / Sub-Spesialisasi
                        </label>
                        <input
                          type="text"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          No. HP / WhatsApp Pelayanan
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bio Ringkas Profil
                      </label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none"
                      />
                    </div>

                    {/* Upload photo button inside edit form */}
                    <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Foto Profil Dokter</p>
                        <p className="text-[11px] text-slate-500">
                          Pilih foto dari galeri / folder internal storage perangkat Anda (JPG, PNG, WebP)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B4FA8] text-white hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto dari Internal</span>
                      </button>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#5B4FA8] hover:bg-purple-800 shadow-md"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Card 2 (Top Right, 4 cols): Status Iuran & KTA IDI matching profil2.jpg */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Status Iuran & KTA IDI</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Nomor Kartu Digital:</p>
                  <p className="font-mono font-bold text-sm text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl mt-1 tracking-wider">
                    {doctor.idiNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Status Keanggotaan:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        doctor.duesStatus === "lunas"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {doctor.duesStatus === "lunas" ? "✓ Lunas & Aktif" : "Menunggak"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Masa Berlaku SIP:</span>
                    <span className="font-bold text-slate-800">{doctor.sipExpiryDate}</span>
                  </div>
                </div>

                {/* Payment channel badges matching profil2.jpg */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    QRIS
                  </span>
                  <span className="text-[10px] font-bold text-[#5B4FA8] bg-purple-50 px-2.5 py-1 rounded-lg">
                    Bank NTB
                  </span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    BRI IDI
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    KTA Lotim
                  </span>
                </div>
              </div>

              {/* Card 3 (Bottom Left, 8 cols): Tempat Praktik Vertical Timeline matching profil2.jpg */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Tempat Praktik & Layanan Pasien
                    </h4>
                    <p className="text-xs text-slate-500">
                      Lokasi faskes terdaftar dengan Surat Izin Praktik (SIP) sah
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#5B4FA8]">
                    {doctor.practicePlaces.length} Lokasi
                  </span>
                </div>

                {/* Vertical Timeline with connected purple bullets matching profil2.jpg */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-200">
                  {doctor.practicePlaces.map((place, idx) => (
                    <div key={place.id} className="relative group">
                      {/* Timeline Node Bullet */}
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#5B4FA8] ring-4 ring-purple-100" />

                      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:border-purple-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">
                              {place.name}
                            </p>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border text-slate-600">
                              {place.type === "dinas" ? "Faskes Pemerintah" : "Praktik Swasta"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{place.address}</p>
                          <p className="text-xs font-semibold text-teal-700">
                            Jadwal: {place.schedule}
                          </p>
                        </div>

                        <span className="self-start sm:self-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Aktif
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4 (Bottom Right, 4 cols): Signature Purple Card matching profil2.jpg */}
              <div className="lg:col-span-4 bg-[#5B4FA8] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <h4 className="text-lg font-black leading-snug">
                    Layanan Keanggotaan IDI Cabang Lotim
                  </h4>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    Fasilitas resmi pengurus bagi dokter anggota Kabupaten Lombok Timur:
                  </p>
                  <ul className="space-y-2 text-xs text-purple-100/90 pt-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                      <span>Rekomendasi SIP Online 1x24 Jam</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                      <span>Validasi SKP Plataran Sehat Kemenkes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                      <span>Bantuan Advokasi & Etika Kedokteran</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                      <span>Unduh Kartu Tanda Anggota (KTA) Digital</span>
                    </li>
                  </ul>
                </div>

                {/* White Rounded Button matching profil2.jpg */}
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Permohonan Rekomendasi SIP sedang diproses. Silakan hubungi Sekretariat IDI Lotim via WhatsApp."
                    )
                  }
                  className="w-full py-3.5 px-5 rounded-full bg-white text-[#5B4FA8] font-black text-xs hover:bg-purple-50 transition-all shadow-md text-center"
                >
                  Ajukan Rekomendasi SIP
                </button>
              </div>

              {/* Card 5 (12 cols): Galeri Foto Praktik Preview & Quick Upload */}
              <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#5B4FA8]" />
                      <span>Galeri Foto Fasilitas, Praktik & Kegiatan</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Foto yang diunggah akan tampil di profil publik agar pasien dan masyarakat dapat mengenal fasilitas praktik Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("gallery")}
                    className="px-4 py-2 rounded-2xl bg-[#5B4FA8] hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Kelola Galeri (+ Upload Foto)</span>
                  </button>
                </div>

                {gallery.length === 0 ? (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      Belum ada foto yang diunggah ke galeri
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Unggah foto ruang praktik, klinik, atau kegiatan medis dari penyimpanan internal perangkat Anda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("gallery")}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-[#5B4FA8] text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Foto Pertama</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {gallery.slice(0, 6).map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImage(imgUrl)}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-[#5B4FA8]"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Galeri ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                    {gallery.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("gallery")}
                        className="aspect-square rounded-2xl border border-dashed border-purple-300 bg-purple-50/50 flex flex-col items-center justify-center text-xs font-bold text-[#5B4FA8] hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <span>+{gallery.length - 6} Lainnya</span>
                        <span className="text-[10px] font-normal text-purple-600">Lihat Semua</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PENGATURAN AKUN (GANTI USERNAME & PASSWORD MANDIRI) */}
          {activeTab === "account" && (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#5B4FA8]" />
                  <span>Ganti Username & Password Akun</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dokter dapat mengganti username dan password login secara mandiri kapan saja.
                </p>
              </div>

              {accountError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{accountError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Username Dokter Baru
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username baru..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B4FA8]/30"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    *Username default Anda adalah: <code className="font-mono font-bold text-[#5B4FA8]">dokter{doctor.orderNumber}</code>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi (Password) Baru
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password baru..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B4FA8]/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Ulangi Kata Sandi (Konfirmasi)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi password baru..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B4FA8]/30"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold text-white bg-[#5B4FA8] hover:bg-purple-800 shadow-md shadow-purple-500/20 transition-all"
                  >
                    Simpan Perubahan Akun
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: TEMPAT & JADWAL PRAKTIK */}
          {activeTab === "practice" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Daftar Tempat Praktik Dokter
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Jadwal ini ditampilkan pada pencarian faskes publik masyarakat Lombok Timur.
                  </p>
                </div>
                <button
                  onClick={() =>
                    alert(
                      "Untuk menambah tempat praktik resmi ke faskes baru, ajukan pembaruan ke Sekretariat IDI Lotim."
                    )
                  }
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-[#5B4FA8] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tempat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.practicePlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-sm">{place.name}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border text-slate-600">
                        {place.type === "dinas" ? "Faskes Dinas" : "Praktik Swasta"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{place.address}</span>
                    </p>
                    <p className="text-xs font-semibold text-teal-700">
                      Jadwal: {place.schedule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEGALITAS STR & SIP */}
          {activeTab === "legalitas" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Status Legalitas Profesi (STR & SIP)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verifikasi berkas oleh IDI Cabang Lombok Timur dan DPM-PTSP Kab. Lombok Timur
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                  <p className="text-xs font-bold text-slate-500">Nomor Registrasi KTA IDI</p>
                  <p className="text-lg font-black text-[#5B4FA8] font-mono">{doctor.idiNumber}</p>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Terdaftar Aktif
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <p className="text-xs font-bold text-slate-500">Surat Tanda Registrasi (STR)</p>
                  <p className="text-sm font-black text-sky-900 font-mono">{doctor.strNumber}</p>
                  <span className="inline-block text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                    STR Seumur Hidup
                  </span>
                </div>

                <div
                  className={`p-5 rounded-2xl border space-y-1 ${
                    doctor.sipDaysLeft <= 90
                      ? "bg-amber-50/80 border-amber-300"
                      : "bg-emerald-50/70 border-emerald-200"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-500">Surat Izin Praktik (SIP)</p>
                  <p className="text-sm font-black text-slate-900 font-mono">{doctor.sipNumber}</p>
                  <p className="text-xs font-bold text-slate-700">
                    Berlaku s/d: {doctor.sipExpiryDate} ({doctor.sipDaysLeft} hari lagi)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PESAN KONSULTASI MASUK */}
          {activeTab === "messages" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-xl font-black text-slate-900">
                Pesan Masuk Konsultasi Pasien
              </h3>
              <p className="text-xs text-slate-500">
                Pesan booking dan pertanyaan dari pengunjung situs publik
              </p>

              <div className="space-y-3 pt-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{msg.sender}</span>
                        <span className="text-slate-500">· Kec. {msg.district}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                          {msg.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{msg.date}</span>
                    </div>

                    <p className="text-slate-700">{msg.content}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/70">
                      <span className="text-slate-500 font-mono">No HP: {msg.phone}</span>
                      <a
                        href={`https://wa.me/62${msg.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Balas via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: IURAN KEANGGOTAAN */}
          {activeTab === "dues" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
              <h3 className="text-xl font-black text-slate-900">
                Iuran Keanggotaan IDI Cabang Lombok Timur
              </h3>

              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Status Iuran:</p>
                  <p className="text-lg font-black text-[#5B4FA8] mt-0.5">
                    {doctor.duesStatus === "lunas" ? "LUNAS TERVERIFIKASI" : "Terdapat Tunggakan"}
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Rp100.000 / Bulan
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p>
                  <strong>Nomor Rekening Resmi:</strong> Bank NTB Syariah Cabang Selong · No. Rekening: <strong>501.02.00012.3</strong> a.n. IDI Cabang Lombok Timur
                </p>
                <p>
                  Konfirmasi bukti transfer ke Bendahara IDI Lombok Timur via WhatsApp sekretariat.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: GALERI FOTO ANGGOTA (UPLOAD DARI INTERNAL STORAGE) */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Header card with Upload CTA */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                      <ImageIcon className="w-6 h-6 text-[#5B4FA8]" />
                      <span>Galeri Foto Praktik & Kegiatan Dokter</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Unggah foto ruang praktik, klinik, peralatan medis, sertifikat, atau kegiatan IDI dari penyimpanan internal perangkat Anda.
                    </p>
                  </div>

                  {/* Hidden input for multi-file gallery selection */}
                  <input
                    type="file"
                    ref={galleryInputRef}
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#5B4FA8] hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingGallery ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isUploadingGallery ? "Memproses Foto..." : "+ Upload Foto dari Internal"}</span>
                  </button>
                </div>

                {/* Upload Status Alerts */}
                {gallerySuccess && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Foto baru berhasil diunggah dan disimpan ke profil Anda!</span>
                  </div>
                )}
                {galleryError && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{galleryError}</span>
                  </div>
                )}

                {/* Drag-and-drop styled uploader box */}
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="mt-6 border-2 border-dashed border-purple-200 hover:border-[#5B4FA8] rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-purple-50/30 hover:bg-purple-50/60 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#5B4FA8] group-hover:scale-110 flex items-center justify-center mx-auto transition-transform shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-slate-800 group-hover:text-[#5B4FA8] transition-colors">
                    Pilih File Foto dari Penyimpanan Internal (Bisa Pilih Banyak Foto Sekaligus)
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                    Mendukung format JPG, PNG, WebP. Foto otomatis dioptimalkan agar cepat dimuat oleh pasien.
                  </p>
                  <span className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-white border border-purple-200 text-[#5B4FA8] font-bold text-xs shadow-sm">
                    Jelajahi File di Perangkat Ini
                  </span>
                </div>
              </div>

              {/* Photo Grid Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    Koleksi Foto Terunggah ({gallery.length} Foto)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Klik foto untuk memperbesar atau ikon tempat sampah untuk menghapus
                  </span>
                </div>

                {gallery.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-600">Belum ada foto di galeri</p>
                    <p className="text-xs text-slate-400">
                      Mulai unggah foto tempat praktik Anda dengan mengklik tombol di atas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Galeri ${doctor.name} - ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay with buttons on hover */}
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImage(imgUrl)}
                            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-[#5B4FA8] shadow-md transition-all cursor-pointer"
                            title="Perbesar Foto"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryPhoto(idx)}
                            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium pointer-events-none">
                          Foto #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal for Photo Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] bg-transparent rounded-2xl overflow-hidden flex items-center justify-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={previewImage}
              alt="Preview Galeri"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortalModal;
