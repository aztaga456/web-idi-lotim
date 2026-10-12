"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import DoctorDirectory from "../components/DoctorDirectory";
import DoctorModal from "../components/DoctorModal";
import BookingModal from "../components/BookingModal";
import AdminDashboardModal from "../components/AdminDashboardModal";
import DoctorPortalModal from "../components/DoctorPortalModal";
import LoginModal from "../components/LoginModal";
import NewsSection from "../components/NewsSection";
import Footer from "../components/Footer";
import { INITIAL_DOCTORS } from "../data/doctors";
import { INITIAL_ARTICLES } from "../data/articles";
import { Doctor, AuthUser, Article } from "../types";

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [activeDoctorForModal, setActiveDoctorForModal] = useState<Doctor | null>(
    null
  );
  const [activeDoctorForBooking, setActiveDoctorForBooking] = useState<Doctor | null>(
    null
  );

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDoctorPortalOpen, setIsDoctorPortalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [likedDoctorIds, setLikedDoctorIds] = useState<string[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem("idi_lotim_liked_doctors");
      if (storedLikes) {
        setLikedDoctorIds(JSON.parse(storedLikes));
      }

      const storedDoctors = localStorage.getItem("idi_lotim_doctors_data");
      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      }

      const storedArticles = localStorage.getItem("idi_lotim_articles_data");
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      }

      const storedUser = localStorage.getItem("idi_lotim_auth_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      // Check URL search parameters to auto-open dashboard when returning from /login
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const panel = params.get("panel");
        if (panel === "admin") {
          setIsAdminOpen(true);
        } else if (panel === "doctor") {
          setIsDoctorPortalOpen(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save articles to localStorage
  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem("idi_lotim_articles_data", JSON.stringify(newArticles));
    } catch (e) {}
  };

  const handleAddArticle = (newArt: Article) => {
    const updated = [newArt, ...articles];
    saveArticles(updated);
  };

  const handleUpdateArticle = (updatedArt: Article) => {
    const updated = articles.map((a) => (a.id === updatedArt.id ? updatedArt : a));
    saveArticles(updated);
  };

  const handleDeleteArticle = (articleId: string) => {
    const updated = articles.filter((a) => a.id !== articleId);
    saveArticles(updated);
  };

  // Save doctors to localStorage whenever updated
  const saveDoctors = (newDoctors: Doctor[]) => {
    setDoctors(newDoctors);
    try {
      localStorage.setItem("idi_lotim_doctors_data", JSON.stringify(newDoctors));
    } catch (e) {}
  };

  // Login handler
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("idi_lotim_auth_user", JSON.stringify(user));
    } catch (e) {}

    // Automatically open appropriate dashboard
    if (user.role === "admin") {
      setIsAdminOpen(true);
    } else {
      setIsDoctorPortalOpen(true);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminOpen(false);
    setIsDoctorPortalOpen(false);
    try {
      localStorage.removeItem("idi_lotim_auth_user");
    } catch (e) {}
  };

  // Open appropriate dashboard
  const handleOpenDashboard = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentUser.role === "admin") {
      setIsAdminOpen(true);
    } else {
      setIsDoctorPortalOpen(true);
    }
  };

  // Doctor CRUD for Admin
  const handleAddDoctor = (newDoc: Doctor) => {
    const updated = [newDoc, ...doctors];
    saveDoctors(updated);
  };

  const handleUpdateDoctor = (updatedDoc: Doctor) => {
    const updated = doctors.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
    saveDoctors(updated);
  };

  const handleDeleteDoctor = (doctorId: string) => {
    const updated = doctors.filter((d) => d.id !== doctorId);
    saveDoctors(updated);
  };

  const handleImportDoctors = (importedDocs: Doctor[]) => {
    const updated = [...doctors, ...importedDocs];
    saveDoctors(updated);
  };

  // Handle like toggle/increment (PRD 5.3)
  const handleLikeDoctor = (doctorId: string) => {
    const updated = doctors.map((doc) => {
      if (doc.id === doctorId) {
        const isLiked = likedDoctorIds.includes(doctorId);
        const newLikes = isLiked ? Math.max(0, doc.likes - 1) : doc.likes + 1;
        return { ...doc, likes: newLikes };
      }
      return doc;
    });
    saveDoctors(updated);

    setLikedDoctorIds((prev) => {
      let updatedIds: string[];
      if (prev.includes(doctorId)) {
        updatedIds = prev.filter((id) => id !== doctorId);
      } else {
        updatedIds = [...prev, doctorId];
      }
      try {
        localStorage.setItem("idi_lotim_liked_doctors", JSON.stringify(updatedIds));
      } catch (e) {}
      return updatedIds;
    });
  };

  // Handle Dues Update from Admin (PRD A4)
  const handleUpdateDues = (doctorId: string, monthsPaid: number) => {
    const updated = doctors.map((doc) => {
      if (doc.id === doctorId) {
        return {
          ...doc,
          duesStatus: "lunas" as const,
          monthsUnpaid: 0,
          lastPaymentDate: new Date().toISOString().split("T")[0],
        };
      }
      return doc;
    });
    saveDoctors(updated);
  };

  // Filter from Hero
  const handleHeroFilter = (cat: string, docId: string) => {
    setSelectedCategory(cat);
    setSelectedDoctorId(docId);
  };

  // Find currently logged-in doctor object
  const activeLoggedInDoctor =
    doctors.find((d) => d.id === currentUser?.doctorId) ||
    doctors.find((d) => d.username === currentUser?.username) ||
    doctors[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F5FA] text-slate-800">
      {/* 1. Frosted Glass Floating Navbar: ONLY Login button at the far end */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* 2. Hero Section matching front end.jpg (text '50 dokter anggota' removed) */}
      <HeroSection
        doctors={doctors}
        selectedCategory={selectedCategory}
        selectedDoctor={selectedDoctorId}
        onFilterChange={handleHeroFilter}
        onOpenBooking={() => {
          setActiveDoctorForBooking(doctors[0]);
          setIsBookingOpen(true);
        }}
      />

      {/* 3. Departemen & Kategori Pelayanan */}
      <ServicesSection
        onSelectCategory={(catName) => setSelectedCategory(catName)}
      />

      {/* 4. Direktori & Pencarian Dokter Terdekat (PRD 5.3) */}
      <DoctorDirectory
        doctors={doctors}
        selectedCategory={selectedCategory}
        selectedDoctorId={selectedDoctorId}
        onSelectDoctor={(doc) => {
          const updatedDoctors = doctors.map((d) =>
            d.id === doc.id ? { ...d, views: (d.views || 0) + 1 } : d
          );
          saveDoctors(updatedDoctors);
          const viewedDoctor = updatedDoctors.find((d) => d.id === doc.id) || doc;
          setActiveDoctorForModal(viewedDoctor);
        }}
        onBookDoctor={(doc) => {
          setActiveDoctorForBooking(doc);
          setIsBookingOpen(true);
        }}
        onLikeDoctor={handleLikeDoctor}
        likedDoctorIds={likedDoctorIds}
      />

      {/* 5. Section Berita & Jurnal Medis (Tumbnail Kiri Besar + List 5 Kanan + Detail Modal) */}
      <NewsSection articles={articles} />

      {/* 6. Alur Kemudahan Bagi Pasien & Pengunjung */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#5B4FA8] border border-purple-200">
              Alur Pelayanan Ramah Pasien
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              3 Langkah Mudah Menemukan Dokter
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Akses cepat tanpa antre panjang dan tanpa registrasi yang rumit bagi masyarakat Lombok Timur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F4F8FC] border border-slate-200/80 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-teal-600/20">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Cari Berdasarkan Kecamatan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih kecamatan domisili Anda di Lombok Timur dan spesialisasi dokter
                yang Anda butuhkan.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F8FC] border border-slate-200/80 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-sky-600/20">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Periksa Jadwal & Legalitas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lihat detail STR, masa berlaku SIP terverifikasi, dan jadwal praktik di RSUD,
                Puskesmas, maupun klinik pribadi.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F8FC] border border-slate-200/80 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[#5B4FA8] text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-purple-600/20">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Kirim Pesan / Konsultasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Isi form booking singkat atau hubungi langsung via WhatsApp resmi dokter
                untuk konfirmasi jadwal temu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer
        onOpenAdmin={() => {
          if (currentUser?.role === "admin") {
            setIsAdminOpen(true);
          } else {
            setIsLoginOpen(true);
          }
        }}
        onOpenDoctorPortal={() => {
          if (currentUser) {
            setIsDoctorPortalOpen(true);
          } else {
            setIsLoginOpen(true);
          }
        }}
        onOpenBooking={() => {
          setActiveDoctorForBooking(doctors[0]);
          setIsBookingOpen(true);
        }}
      />

      {/* Modals */}
      <DoctorModal
        doctor={activeDoctorForModal}
        onClose={() => setActiveDoctorForModal(null)}
        onBookDoctor={(doc) => {
          setActiveDoctorForBooking(doc);
          setIsBookingOpen(true);
        }}
        onLikeDoctor={handleLikeDoctor}
        isLiked={activeDoctorForModal ? likedDoctorIds.includes(activeDoctorForModal.id) : false}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedDoctor={activeDoctorForBooking}
        doctors={doctors}
      />

      {/* Admin Panel Modal (Strictly requires Admin Login) */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        doctors={doctors}
        onAddDoctor={handleAddDoctor}
        onUpdateDoctor={handleUpdateDoctor}
        onDeleteDoctor={handleDeleteDoctor}
        onImportDoctors={handleImportDoctors}
        onUpdateDues={handleUpdateDues}
        onLogout={handleLogout}
        articles={articles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
      />

      {/* Doctor Member Portal Modal (Requires Doctor Login) */}
      <DoctorPortalModal
        isOpen={isDoctorPortalOpen}
        onClose={() => setIsDoctorPortalOpen(false)}
        doctor={activeLoggedInDoctor}
        onSaveProfile={handleUpdateDoctor}
        onLogout={handleLogout}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        doctors={doctors}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenDashboard={handleOpenDashboard}
      />
    </div>
  );
}
