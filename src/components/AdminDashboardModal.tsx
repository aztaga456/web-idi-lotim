"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Building,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Plus,
  Trash2,
  Edit,
  KeyRound,
  FileSpreadsheet,
  Check,
  UserCheck,
  DollarSign,
  Activity,
  UserPlus,
  LogOut,
  BookOpen,
  Newspaper,
  Image as ImageIcon,
} from "lucide-react";
import { Doctor, DoctorCategory, Article } from "../types";
import { Logo } from "./Logo";
import { DISTRICTS } from "../data/districts";
import { CATEGORIES } from "../data/categories";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onAddDoctor: (newDoctor: Doctor) => void;
  onUpdateDoctor: (updatedDoctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
  onImportDoctors: (importedDoctors: Doctor[]) => void;
  onUpdateDues?: (doctorId: string, monthsPaid: number) => void;
  onLogout?: () => void;
  articles?: Article[];
  onAddArticle?: (newArticle: Article) => void;
  onUpdateArticle?: (updatedArticle: Article) => void;
  onDeleteArticle?: (articleId: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  doctors,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onImportDoctors,
  onUpdateDues,
  onLogout,
  articles = [],
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "doctors" | "dues" | "sip" | "admins" | "articles"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "doctor">("all");

  // Form states for Add / Edit Doctor
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<DoctorCategory>("Dokter Umum");
  const [formSpecialization, setFormSpecialization] = useState("");
  const [formIdiNumber, setFormIdiNumber] = useState("");
  const [formStrNumber, setFormStrNumber] = useState("");
  const [formSipNumber, setFormSipNumber] = useState("");
  const [formSipExpiry, setFormSipExpiry] = useState("2028-12-31");
  const [formDistrict, setFormDistrict] = useState("Selong");
  const [formPracticeName, setFormPracticeName] = useState("RSUD Dr. R. Soedjono Selong");
  const [formPracticeSchedule, setFormPracticeSchedule] = useState("Senin - Kamis: 08.30 - 13.00 WITA");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("1234");
  const [formRole, setFormRole] = useState<"doctor" | "admin">("doctor");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = document.createElement("img");
      img.onload = () => {
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
          setFormPhotoUrl(canvas.toDataURL("image/jpeg", 0.85));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importStatusMsg, setImportStatusMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dues state
  const [selectedDuesDoctor, setSelectedDuesDoctor] = useState<Doctor | null>(null);
  const [monthsToPay, setMonthsToPay] = useState<number>(1);
  const [successPaymentMsg, setSuccessPaymentMsg] = useState("");

  // Article Management States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState<Article["category"]>("Berita IDI");
  const [articleType, setArticleType] = useState<"berita" | "jurnal">("berita");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("Pengurus IDI Cabang Lotim");
  const [articleAuthorRole, setArticleAuthorRole] = useState("Tim Redaksi Medis");
  const [articleDate, setArticleDate] = useState(new Date().toISOString().split("T")[0]);
  const [articleReadTime, setArticleReadTime] = useState("4 mnt baca");
  const [articleThumbnailUrl, setArticleThumbnailUrl] = useState("");
  const [articleSearchTerm, setArticleSearchTerm] = useState("");
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>("all");
  const articleThumbInputRef = useRef<HTMLInputElement>(null);

  // Handle article thumbnail upload from internal storage
  const handleArticleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

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
          setArticleThumbnailUrl(canvas.toDataURL("image/jpeg", 0.82));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const openAddArticle = () => {
    setEditingArticle(null);
    setArticleTitle("");
    setArticleCategory("Berita IDI");
    setArticleType("berita");
    setArticleSummary("");
    setArticleContent("");
    setArticleAuthor("Pengurus IDI Cabang Lotim");
    setArticleAuthorRole("Tim Publikasi Ilmiah");
    setArticleDate(new Date().toISOString().split("T")[0]);
    setArticleReadTime("4 mnt baca");
    setArticleThumbnailUrl("");
    setIsArticleModalOpen(true);
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleTitle(art.title);
    setArticleCategory(art.category);
    setArticleType(art.type);
    setArticleSummary(art.summary);
    setArticleContent(art.content);
    setArticleAuthor(art.author);
    setArticleAuthorRole(art.authorRole || "Penulis");
    setArticleDate(art.date);
    setArticleReadTime(art.readTime || "4 mnt baca");
    setArticleThumbnailUrl(art.thumbnailUrl);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    if (editingArticle) {
      const updated: Article = {
        ...editingArticle,
        title: articleTitle.trim(),
        category: articleCategory,
        type: articleType,
        summary: articleSummary.trim(),
        content: articleContent.trim(),
        author: articleAuthor.trim(),
        authorRole: articleAuthorRole.trim(),
        date: articleDate,
        readTime: articleReadTime.trim(),
        thumbnailUrl: articleThumbnailUrl || editingArticle.thumbnailUrl,
      };
      if (onUpdateArticle) onUpdateArticle(updated);
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: articleTitle.trim(),
        category: articleCategory,
        type: articleType,
        summary: articleSummary.trim(),
        content: articleContent.trim(),
        author: articleAuthor.trim(),
        authorRole: articleAuthorRole.trim(),
        date: articleDate,
        readTime: articleReadTime.trim(),
        thumbnailUrl:
          articleThumbnailUrl ||
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        views: 1,
      };
      if (onAddArticle) onAddArticle(newArt);
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticleClick = (artId: string) => {
    if (confirm("Hapus publikasi berita / jurnal ini dari portal?")) {
      if (onDeleteArticle) onDeleteArticle(artId);
    }
  };

  if (!isOpen) return null;

  // Stats calculation
  const totalRegistered = doctors.length;
  const adminDoctors = doctors.filter((d) => d.role === "admin");
  const paidDoctorsCount = doctors.filter((d) => d.duesStatus === "lunas").length;
  const unpaidDoctorsCount = doctors.filter((d) => d.duesStatus !== "lunas").length;
  const expiringSipCount = doctors.filter((d) => d.sipDaysLeft <= 90).length;
  const collectedDuesThisMonth = paidDoctorsCount * 100000;

  // Open Edit Form
  const openEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormName(doc.name);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormSpecialization(doc.specialization);
    setFormIdiNumber(doc.idiNumber);
    setFormStrNumber(doc.strNumber);
    setFormSipNumber(doc.sipNumber);
    setFormSipExpiry(doc.sipExpiryDate);
    setFormDistrict(doc.district);
    setFormPracticeName(doc.practicePlaces[0]?.name || "RSUD Dr. R. Soedjono Selong");
    setFormPracticeSchedule(doc.practicePlaces[0]?.schedule || "Senin - Kamis: 08.30 - 13.00 WITA");
    setFormPhone(doc.phone);
    setFormEmail(doc.email);
    setFormUsername(doc.username);
    setFormPassword(doc.password);
    setFormRole(doc.role);
    setFormPhotoUrl(doc.photoUrl);
    setIsAddModalOpen(true);
  };

  // Open Add Form
  const openAdd = () => {
    setEditingDoctor(null);
    const nextOrder = doctors.length + 1;
    setFormName("");
    setFormTitle("Dokter Umum");
    setFormCategory("Dokter Umum");
    setFormSpecialization("Pelayanan Kesehatan Primer");
    setFormIdiNumber(`IDI-5203-${String(10000 + nextOrder)}`);
    setFormStrNumber(`33.1.2.100.1.24.${String(100000 + nextOrder)}`);
    setFormSipNumber(`503/SIP-DU/0${String(450 + nextOrder)}/DPM-PTSP/2024`);
    setFormSipExpiry("2029-01-01");
    setFormDistrict("Selong");
    setFormPracticeName("Puskesmas Selong");
    setFormPracticeSchedule("Senin - Sabtu: 08.00 - 12.30 WITA");
    setFormPhone("081912345678");
    setFormEmail(`dokter${nextOrder}@idilotim.id`);
    setFormUsername(`dokter${nextOrder}`);
    setFormPassword("1234");
    setFormRole("doctor");
    setFormPhotoUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80");
    setIsAddModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingDoctor) {
      const updated: Doctor = {
        ...editingDoctor,
        name: formName,
        title: formTitle,
        category: formCategory,
        specialization: formSpecialization,
        idiNumber: formIdiNumber,
        strNumber: formStrNumber,
        sipNumber: formSipNumber,
        sipExpiryDate: formSipExpiry,
        district: formDistrict,
        phone: formPhone,
        email: formEmail,
        username: formUsername.trim() || editingDoctor.username,
        password: formPassword.trim() || editingDoctor.password,
        role: formRole,
        photoUrl: formPhotoUrl || editingDoctor.photoUrl,
        practicePlaces: [
          {
            id: editingDoctor.practicePlaces[0]?.id || `pp-${Date.now()}`,
            name: formPracticeName,
            type: "dinas",
            address: `Kec. ${formDistrict}, Lombok Timur`,
            district: formDistrict,
            schedule: formPracticeSchedule,
          },
        ],
      };
      onUpdateDoctor(updated);
    } else {
      const newOrder = doctors.length + 1;
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        orderNumber: newOrder,
        name: formName,
        title: formTitle,
        gender: "Laki-laki",
        category: formCategory,
        specialization: formSpecialization,
        idiNumber: formIdiNumber,
        strNumber: formStrNumber,
        sipNumber: formSipNumber,
        sipExpiryDate: formSipExpiry,
        sipDaysLeft: 500,
        bio: `${formName} adalah dokter anggota IDI Lombok Timur yang melayani di ${formPracticeName}, Kec. ${formDistrict}.`,
        photoUrl: formPhotoUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
        phone: formPhone,
        email: formEmail,
        district: formDistrict,
        username: formUsername.trim() || `dokter${newOrder}`,
        password: formPassword.trim() || "1234",
        role: formRole,
        practicePlaces: [
          {
            id: `pp-${Date.now()}`,
            name: formPracticeName,
            type: "dinas",
            address: `Kec. ${formDistrict}, Lombok Timur`,
            district: formDistrict,
            schedule: formPracticeSchedule,
          },
        ],
        socialLinks: { whatsapp: `https://wa.me/62${formPhone.replace(/^0/, "")}` },
        gallery: [],
        likes: 10,
        views: 50,
        duesStatus: "lunas",
        monthsUnpaid: 0,
        lastPaymentDate: new Date().toISOString().split("T")[0],
      };
      onAddDoctor(newDoc);
    }

    setIsAddModalOpen(false);
  };

  // Handle CSV / Excel / Doc file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Parse CSV or plain text lines
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        const parsed: any[] = [];

        // Check if header exists
        const startIdx = lines[0].toLowerCase().includes("nama") ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
          const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ""));
          if (parts[0]) {
            parsed.push({
              name: parts[0] || `dr. Anggota ${i}`,
              category: parts[1] || "Dokter Umum",
              district: parts[2] || "Selong",
              sip: parts[3] || `503/SIP/${Date.now()}`,
              phone: parts[4] || "081912345678",
            });
          }
        }

        if (parsed.length > 0) {
          setImportPreview(parsed);
          setImportStatusMsg(`Berhasil membaca ${parsed.length} data dokter dari berkas!`);
        } else {
          setImportStatusMsg("Format berkas tidak terbaca. Pastikan terdapat kolom nama dokter.");
        }
      } catch (err) {
        setImportStatusMsg("Gagal memproses berkas. Pastikan berkas berformat CSV/Excel/Text.");
      }
    };
    reader.readAsText(file);
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (importPreview.length === 0) return;

    const currentLen = doctors.length;
    const newDocs: Doctor[] = importPreview.map((item, idx) => {
      const order = currentLen + idx + 1;
      return {
        id: `doc-imp-${Date.now()}-${idx}`,
        orderNumber: order,
        name: item.name,
        title: item.category.includes("Spesialis") ? item.category : "Dokter Umum",
        gender: "Laki-laki",
        category: (item.category as DoctorCategory) || "Dokter Umum",
        specialization: "Pelayanan Kesehatan IDI",
        idiNumber: `IDI-5203-${String(20000 + order)}`,
        strNumber: `33.1.2.100.1.24.${String(200000 + order)}`,
        sipNumber: item.sip || `503/SIP-DU/0${String(500 + order)}/DPM-PTSP/2024`,
        sipExpiryDate: "2029-01-01",
        sipDaysLeft: 600,
        bio: `${item.name} adalah dokter anggota IDI Lombok Timur di Kec. ${item.district}.`,
        photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
        phone: item.phone || "081912345678",
        email: `dokter${order}@idilotim.id`,
        district: item.district || "Selong",
        username: `dokter${order}`,
        password: "1234",
        role: "doctor",
        practicePlaces: [
          {
            id: `pp-imp-${Date.now()}-${idx}`,
            name: `Fasilitas Kesehatan Kec. ${item.district}`,
            type: "dinas",
            address: `Kec. ${item.district}, Lombok Timur`,
            district: item.district || "Selong",
            schedule: "Senin - Sabtu: 08.00 - 12.30 WITA",
          },
        ],
        socialLinks: {},
        gallery: [],
        likes: 5,
        views: 20,
        duesStatus: "lunas",
        monthsUnpaid: 0,
        lastPaymentDate: new Date().toISOString().split("T")[0],
      };
    });

    onImportDoctors(newDocs);
    setIsImportModalOpen(false);
    setImportPreview([]);
    setImportStatusMsg("");
    alert(`Sukses mengimpor ${newDocs.length} anggota baru ke dalam sistem!`);
  };

  // Export / Download Data Anggota as CSV
  const handleDownloadData = () => {
    const headers = [
      "No",
      "Nama Dokter",
      "Gelar",
      "Kategori",
      "Spesialisasi",
      "NPA IDI",
      "Nomor STR",
      "Nomor SIP",
      "Masa Berlaku SIP",
      "Kecamatan",
      "Telepon",
      "Status Iuran",
      "Akses Role",
      "Username",
      "Password",
    ];

    const rows = doctors.map((d, index) => [
      index + 1,
      `"${d.name}"`,
      `"${d.title}"`,
      `"${d.category}"`,
      `"${d.specialization}"`,
      `"${d.idiNumber}"`,
      `"${d.strNumber}"`,
      `"${d.sipNumber}"`,
      `"${d.sipExpiryDate}"`,
      `"${d.district}"`,
      `"${d.phone}"`,
      `"${d.duesStatus}"`,
      `"${d.role === "admin" ? "Admin Pengurus" : "Dokter Anggota"}"`,
      `"${d.username}"`,
      `"${d.password}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data-anggota-idi-lotim-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Record Dues Payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDuesDoctor) return;

    if (onUpdateDues) {
      onUpdateDues(selectedDuesDoctor.id, monthsToPay);
    }
    setSuccessPaymentMsg(
      `Pembayaran ${monthsToPay} bulan (Rp${(monthsToPay * 100000).toLocaleString("id-ID")}) untuk ${selectedDuesDoctor.name} berhasil dicatat!`
    );
    setTimeout(() => {
      setSuccessPaymentMsg("");
      setSelectedDuesDoctor(null);
    }, 2500);
  };

  const filteredDoctors = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      filterRole === "all" ? true : d.role === filterRole;

    return matchSearch && matchRole;
  });

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#E8EEF7] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      {/* Left Sidebar: Signature Deep Royal Purple (#5B4FA8) matching dasboard.jpg */}
      <aside className="w-full md:w-64 bg-[#5B4FA8] text-white p-5 flex flex-col justify-between shrink-0 shadow-xl h-full overflow-y-auto">
          <div className="space-y-6">
            <div className="pb-4 border-b border-purple-400/20">
              <Logo variant="white" size="sm" />
            </div>

            <nav className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  activeTab === "overview"
                    ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                    : "text-purple-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4" />
                  <span>Dashboard Ringkasan</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("doctors")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  activeTab === "doctors"
                    ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                    : "text-purple-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Kelola Anggota</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-900/40 text-purple-200">
                  {totalRegistered}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("admins")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  activeTab === "admins"
                    ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                    : "text-purple-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4" />
                  <span>Daftar Pengurus Admin</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                  {adminDoctors.length}
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
                  <span>Iuran Anggota</span>
                </div>
                {unpaidDoctorsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                    {unpaidDoctorsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("sip")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  activeTab === "sip"
                    ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                    : "text-purple-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Monitoring SIP & STR</span>
                </div>
                {expiringSipCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                    {expiringSipCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("articles")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  activeTab === "articles"
                    ? "bg-white text-[#5B4FA8] shadow-md font-bold"
                    : "text-purple-100 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Berita & Jurnal</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-400 text-teal-950 font-bold">
                  {articles.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-purple-400/20 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Multi-Admin Aktif</span>
              </div>
              <p className="text-[11px] text-purple-200">
                {adminDoctors.length} Dokter memiliki hak akses Admin
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
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
                  <span>Logout Admin</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#E8EEF7]">
          {/* Header Bar */}
          <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {activeTab === "overview" && "Dashboard Pengurus Cabang"}
                {activeTab === "doctors" && "Manajemen Data & Hak Akses Anggota"}
                {activeTab === "admins" && "Daftar Pengurus Cabang (Multi-Admin)"}
                {activeTab === "dues" && "Pencatatan Iuran Bulanan (Rp100.000/bln)"}
                {activeTab === "sip" && "Pengingat Kedaluwarsa SIP & STR"}
                {activeTab === "articles" && "Kelola Publikasi Berita & Jurnal Medis"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Informasi Keanggotaan IDI Kabupaten Lombok Timur
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, user, atau SIP..."
                  className="w-48 lg:w-60 pl-8 pr-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm"
                title="Keluar dari Panel Admin"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Scrollable Main Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Total Anggota
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {totalRegistered} <span className="text-xs font-normal text-slate-400">dokter</span>
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-teal-600">
                        {adminDoctors.length} Pengurus Admin
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Iuran Terkumpul
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        Rp{(collectedDuesThisMonth / 1000000).toFixed(1)}Jt
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600">
                        {paidDoctorsCount} Anggota Lunas
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Menunggak Iuran
                      </p>
                      <p className="text-2xl font-black text-rose-600 mt-1">
                        {unpaidDoctorsCount} <span className="text-xs font-normal text-slate-400">Dokter</span>
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-rose-500">
                        Perlu Pengingat WA
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        SIP Segera Berakhir
                      </p>
                      <p className="text-2xl font-black text-amber-600 mt-1">
                        {expiringSipCount} <span className="text-xs font-normal text-slate-400">Dokter</span>
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-amber-600">
                        &le; 90 Hari Sisa
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Quick Action Bar for Admin */}
                <div className="p-4 bg-white rounded-3xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Aksi Cepat:</span>
                    <button
                      onClick={openAdd}
                      className="px-3 py-1.5 rounded-xl bg-[#5B4FA8] hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Tambah Anggota Manual</span>
                    </button>
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import Berkas (Excel/CSV/Doc)</span>
                    </button>
                  </div>

                  <button
                    onClick={handleDownloadData}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Seluruh Data Anggota</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: KELOLA ANGGOTA (ADD, EDIT, DELETE, GANTI USER/PASS, JADIKAN ADMIN) */}
            {(activeTab === "doctors" || activeTab === "admins") && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {activeTab === "admins"
                        ? "Daftar Pengurus Cabang yang Memiliki Akses Admin"
                        : "Kelola Data Seluruh Anggota Dokter IDI Lombok Timur"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tambah baru, edit profil, ganti username & password, atau beri akses admin.
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={openAdd}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B4FA8] hover:bg-purple-800 text-white flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Tambah Dokter</span>
                    </button>

                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import Berkas</span>
                    </button>

                    <button
                      onClick={handleDownloadData}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
                      title="Unduh data dalam format CSV/Excel"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Data</span>
                    </button>
                  </div>
                </div>

                {/* Filter role pill */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-bold">Filter Akses:</span>
                  <button
                    onClick={() => setFilterRole("all")}
                    className={`px-3 py-1 rounded-full font-bold ${
                      filterRole === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Semua ({doctors.length})
                  </button>
                  <button
                    onClick={() => setFilterRole("admin")}
                    className={`px-3 py-1 rounded-full font-bold ${
                      filterRole === "admin"
                        ? "bg-[#5B4FA8] text-white"
                        : "bg-purple-50 text-[#5B4FA8] hover:bg-purple-100"
                    }`}
                  >
                    Akses Admin ({adminDoctors.length})
                  </button>
                  <button
                    onClick={() => setFilterRole("doctor")}
                    className={`px-3 py-1 rounded-full font-bold ${
                      filterRole === "doctor"
                        ? "bg-teal-600 text-white"
                        : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                    }`}
                  >
                    Dokter Biasa ({doctors.length - adminDoctors.length})
                  </button>
                </div>

                {/* Doctors Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">Dokter</th>
                        <th className="py-3 px-3">Kategori & Wilayah</th>
                        <th className="py-3 px-3">Login Akun (User / Pass)</th>
                        <th className="py-3 px-3">Hak Akses Role</th>
                        <th className="py-3 px-3">Status SIP</th>
                        <th className="py-3 px-3 text-center">Aksi Pengurus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredDoctors.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border">
                                <Image
                                  src={doc.photoUrl}
                                  alt={doc.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{doc.name}</p>
                                <p className="text-[11px] text-slate-500 font-mono">
                                  {doc.idiNumber}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-slate-800">{doc.category}</p>
                            <p className="text-[11px] text-slate-500">Kec. {doc.district}</p>
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 font-mono text-[11px]">
                              <p>
                                User: <strong className="text-teal-700">{doc.username}</strong>
                              </p>
                              <p className="text-slate-500">
                                Pass: <strong className="text-slate-800">{doc.password}</strong>
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {doc.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-[#5B4FA8] border border-purple-200">
                                <Shield className="w-3 h-3" />
                                Admin Pengurus
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                <UserCheck className="w-3 h-3 text-slate-400" />
                                Dokter Anggota
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {doc.sipDaysLeft <= 90 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Segera perpanjang ({doc.sipDaysLeft} hari)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Aktif ({doc.sipExpiryDate})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEdit(doc)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-[#5B4FA8] transition-colors"
                                title="Edit data / Ubah user & pass / Atur role admin"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Apakah Anda yakin ingin menghapus data anggota ${doc.name}?`
                                    )
                                  ) {
                                    onDeleteDoctor(doc.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
                                title="Hapus anggota"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: IURAN ANGGOTA */}
            {activeTab === "dues" && (
              <div className="space-y-6">
                {successPaymentMsg && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{successPaymentMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#5B4FA8]" />
                      Catat Iuran Anggota (Bendahara)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sesuai PRD: Nominal Rp100.000 / bulan. Pilihan pembayaran 1, 2, 3, 6,
                      atau 12 bulan sekaligus.
                    </p>

                    <form onSubmit={handleRecordPayment} className="space-y-3.5 pt-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Pilih Dokter
                        </label>
                        <select
                          value={selectedDuesDoctor?.id || ""}
                          onChange={(e) => {
                            const found = doctors.find((d) => d.id === e.target.value);
                            setSelectedDuesDoctor(found || null);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                        >
                          <option value="">-- Pilih Dokter yang Membayar --</option>
                          {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.duesStatus === "lunas" ? "Lunas" : `Nunggak ${d.monthsUnpaid} bln`})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          Pilihan Periode Pembayaran
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 6, 12].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMonthsToPay(m)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                                monthsToPay === m
                                  ? "bg-[#5B4FA8] text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {m} Bln
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-purple-900">Total Nominal:</span>
                        <span className="text-base font-black text-[#5B4FA8]">
                          Rp{(monthsToPay * 100000).toLocaleString("id-ID")}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedDuesDoctor}
                        className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-[#5B4FA8] hover:bg-purple-800 disabled:opacity-50 shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Simpan & Terbitkan Kuitansi</span>
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Status Iuran Anggota Bulan Ini
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold">
                            <th className="py-2.5 px-2">Dokter</th>
                            <th className="py-2.5 px-2">Status</th>
                            <th className="py-2.5 px-2">Tunggakan</th>
                            <th className="py-2.5 px-2">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {doctors.map((d) => (
                            <tr key={d.id}>
                              <td className="py-2.5 px-2 font-medium">{d.name}</td>
                              <td className="py-2.5 px-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    d.duesStatus === "lunas"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {d.duesStatus === "lunas" ? "Lunas" : "Menunggak"}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-slate-500">
                                {d.monthsUnpaid > 0 ? `${d.monthsUnpaid} bulan` : "-"}
                              </td>
                              <td className="py-2.5 px-2">
                                <button
                                  onClick={() => setSelectedDuesDoctor(d)}
                                  className="text-xs font-bold text-[#5B4FA8] hover:underline"
                                >
                                  Catat Bayar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SIP MONITORING */}
            {activeTab === "sip" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  Pengingat Otomatis Masa Berlaku SIP (PRD A2)
                </h3>
                <div className="space-y-3 pt-2">
                  {doctors.map((doc) => {
                    const isExpiringSoon = doc.sipDaysLeft <= 90;
                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isExpiringSoon
                            ? "bg-amber-50/60 border-amber-300"
                            : "bg-slate-50/60 border-slate-200/70"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {doc.name}
                            </span>
                            {isExpiringSoon && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                                Segera Perpanjang
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Nomor SIP: <strong className="font-mono">{doc.sipNumber}</strong>
                          </p>
                        </div>
                        <div className="text-right sm:self-center">
                          <p className="text-xs text-slate-500">Batas Berlaku:</p>
                          <p className="text-sm font-bold text-slate-800">
                            {doc.sipExpiryDate}
                          </p>
                          <p
                            className={`text-[11px] font-bold ${
                              isExpiringSoon ? "text-amber-700" : "text-emerald-700"
                            }`}
                          >
                            Sisa {doc.sipDaysLeft} hari lagi
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: KELOLA BERITA & JURNAL MEDIS */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                {/* Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Total Publikasi
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {articles.length} <span className="text-xs font-normal text-slate-400">artikel</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Berita IDI
                      </p>
                      <p className="text-2xl font-black text-teal-700 mt-1">
                        {articles.filter((a) => a.type === "berita").length}{" "}
                        <span className="text-xs font-normal text-slate-400">rilis</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Newspaper className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Jurnal Medis
                      </p>
                      <p className="text-2xl font-black text-[#5B4FA8] mt-1">
                        {articles.filter((a) => a.type === "jurnal").length}{" "}
                        <span className="text-xs font-normal text-slate-400">jurnal</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B4FA8] flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Filter and Add Button Header */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={articleSearchTerm}
                        onChange={(e) => setArticleSearchTerm(e.target.value)}
                        placeholder="Cari judul, penulis, topik..."
                        className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4FA8]/30"
                      />
                    </div>

                    <select
                      value={articleCategoryFilter}
                      onChange={(e) => setArticleCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="berita">Khusus Berita</option>
                      <option value="jurnal">Khusus Jurnal</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={openAddArticle}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#5B4FA8] hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Berita / Jurnal</span>
                  </button>
                </div>

                {/* Article List / Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Daftar Publikasi ({articles.length} Dokumen)
                    </h3>
                    <span className="text-xs text-slate-400">
                      Publikasi langsung tampil di section Berita & Jurnal front end
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {articles
                      .filter((art) => {
                        const matchFilter =
                          articleCategoryFilter === "all"
                            ? true
                            : articleCategoryFilter === "berita"
                            ? art.type === "berita"
                            : art.type === "jurnal";
                        const matchSearch =
                          art.title.toLowerCase().includes(articleSearchTerm.toLowerCase()) ||
                          art.author.toLowerCase().includes(articleSearchTerm.toLowerCase()) ||
                          art.summary.toLowerCase().includes(articleSearchTerm.toLowerCase());
                        return matchFilter && matchSearch;
                      })
                      .map((art) => (
                        <div
                          key={art.id}
                          className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {/* Thumbnail preview */}
                            <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <Image
                                src={art.thumbnailUrl}
                                alt={art.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    art.type === "jurnal"
                                      ? "bg-purple-100 text-[#5B4FA8]"
                                      : "bg-teal-100 text-teal-800"
                                  }`}
                                >
                                  {art.type === "jurnal" ? "Jurnal Ilmiah" : "Berita IDI"}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {art.category}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-[11px] text-slate-400">{art.date}</span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                                {art.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                                {art.summary}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Penulis: <strong className="text-slate-700">{art.author}</strong> ({art.authorRole || "Penulis"})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditArticle(art)}
                              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B4FA8] font-bold text-xs flex items-center gap-1.5 border border-purple-200 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticleClick(art.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

      {/* MODAL 1: TAMBAH / EDIT ANGGOTA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#5B4FA8]" />
                <span>
                  {editingDoctor ? `Edit Anggota: ${editingDoctor.name}` : "Tambah Anggota Dokter Baru"}
                </span>
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: dr. Fajar Nugraha, Sp.B"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Spesialisasi</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">NPA IDI</label>
                  <input
                    type="text"
                    value={formIdiNumber}
                    onChange={(e) => setFormIdiNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor STR</label>
                  <input
                    type="text"
                    value={formStrNumber}
                    onChange={(e) => setFormStrNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor SIP</label>
                  <input
                    type="text"
                    value={formSipNumber}
                    onChange={(e) => setFormSipNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kecamatan Lotim</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        Kec. {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tempat Praktik Utama</label>
                  <input
                    type="text"
                    value={formPracticeName}
                    onChange={(e) => setFormPracticeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Masa Berlaku SIP</label>
                  <input
                    type="date"
                    value={formSipExpiry}
                    onChange={(e) => setFormSipExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              {/* SECTION AKUN LOGIN & HAK AKSES ADMIN */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                <p className="font-bold text-[#5B4FA8] flex items-center gap-1.5 text-xs">
                  <KeyRound className="w-4 h-4" />
                  <span>Pengaturan Login Akun & Hak Akses Pengurus Admin</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Username Login</label>
                    <input
                      type="text"
                      required
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs"
                      placeholder="contoh: dokter51"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Password Login</label>
                    <input
                      type="text"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs"
                      placeholder="default: 1234"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-200/60">
                  <label className="font-bold text-slate-700 block mb-1">
                    Hak Akses Akun:
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="adminRole"
                        checked={formRole === "doctor"}
                        onChange={() => setFormRole("doctor")}
                        className="text-[#5B4FA8]"
                      />
                      <span>Dokter Anggota (Hanya Portal Pribadi)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#5B4FA8]">
                      <input
                        type="radio"
                        name="adminRole"
                        checked={formRole === "admin"}
                        onChange={() => setFormRole("admin")}
                        className="text-[#5B4FA8]"
                      />
                      <Shield className="w-3.5 h-3.5" />
                      <span>Jadikan Admin Pengurus (Bisa Kelola Anggota)</span>
                    </label>
                  </div>
                </div>

                {/* Upload Foto Dokter dari Internal Storage */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={photoFileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow shrink-0 relative">
                      <Image
                        src={formPhotoUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"}
                        alt="Pratinjau"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Foto Profil Dokter</p>
                      <p className="text-[11px] text-slate-500">Pilih file foto dari penyimpanan internal perangkat</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B4FA8] font-bold text-xs border border-purple-200 transition-colors shrink-0 shadow-sm"
                  >
                    Unggah Foto
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#5B4FA8] hover:bg-purple-800 font-bold text-white shadow-md"
                >
                  {editingDoctor ? "Simpan Perubahan" : "Tambahkan Dokter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORT ANGGOTA DARI BERKAS (CSV, EXCEL, DOC) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <span>Import Data Anggota Dokter (CSV, Excel, Word / Text)</span>
              </h4>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreview([]);
                  setImportStatusMsg("");
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Pilih berkas dari komputer Anda (format <strong>.csv</strong>, <strong>.txt</strong>, <strong>.xlsx / .xls</strong>, atau <strong>.doc</strong>).
                Format baris yang didukung:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                <p>Nama Dokter, Kategori Spesialis, Kecamatan, Nomor SIP, Telepon</p>
                <p className="text-slate-400">Contoh: dr. Budi Santoso, Spesialis Anak, Selong, 503/SIP/2024, 081912345678</p>
              </div>

              {/* File Input Box */}
              <div className="p-6 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/40 text-center space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, .txt, .xlsx, .xls, .doc, .docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FileSpreadsheet className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="font-bold text-slate-800">
                  Klik untuk Memilih Berkas CSV / Excel / Dokumen
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Pilih Berkas
                </button>
              </div>

              {importStatusMsg && (
                <p className="font-bold text-teal-800 p-2 bg-teal-50 rounded-lg">
                  {importStatusMsg}
                </p>
              )}

              {/* Preview Table */}
              {importPreview.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="font-bold text-slate-800">
                    Pratinjau Data yang Akan Diimpor ({importPreview.length} Anggota):
                  </p>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="p-2">Nama</th>
                          <th className="p-2">Kategori</th>
                          <th className="p-2">Kecamatan</th>
                          <th className="p-2">SIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {importPreview.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.district}</td>
                            <td className="p-2 font-mono text-[11px]">{item.sip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    *Setiap anggota yang diimpor akan dibuatkan akun otomatis dengan username: <code className="font-mono">dokter[nomor]</code> dan password: <code className="font-mono">1234</code>.
                  </p>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportPreview([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importPreview.length === 0}
                  onClick={handleConfirmImport}
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 font-bold text-white shadow-md"
                >
                  Konfirmasi Import ({importPreview.length} Anggota)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH / EDIT BERITA & JURNAL (ADMIN MANAGED) */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#5B4FA8]" />
                <span>
                  {editingArticle
                    ? `Edit Publikasi: ${editingArticle.title}`
                    : "Tambah Publikasi Berita / Jurnal Baru"}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              {/* Type and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tipe Publikasi *</label>
                  <select
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="berita">Berita / Siaran Pers Organisasi</option>
                    <option value="jurnal">Jurnal Medis / Riset Ilmiah</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Artikel *</label>
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Berita IDI">Berita IDI</option>
                    <option value="Jurnal Medis">Jurnal Medis</option>
                    <option value="Kesehatan Masyarakat">Kesehatan Masyarakat</option>
                    <option value="Kegiatan Ilmiah">Kegiatan Ilmiah</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Berita / Jurnal *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul yang informatif..."
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Penulis / Tim *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: dr. H. Muhammad Ikhsan, Sp.PD"
                    value={articleAuthor}
                    onChange={(e) => setArticleAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jabatan / Gelar Penulis</label>
                  <input
                    type="text"
                    placeholder="Contoh: Komite Ilmiah IDI Lotim"
                    value={articleAuthorRole}
                    onChange={(e) => setArticleAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              {/* Date & Read time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Publikasi</label>
                  <input
                    type="date"
                    value={articleDate}
                    onChange={(e) => setArticleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    placeholder="Contoh: 4 mnt baca"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              {/* Thumbnail Image Uploader */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 block">Thumbnail / Foto Cover</label>
                    <p className="text-[11px] text-slate-500">
                      Unggah foto dari penyimpanan internal atau gunakan gambar cover default
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={articleThumbInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleArticleThumbUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => articleThumbInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#5B4FA8] hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto Internal</span>
                  </button>
                </div>

                {articleThumbnailUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                    <Image
                      src={articleThumbnailUrl}
                      alt="Pratinjau Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ringkasan Singkat / Abstrak *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk preview daftar..."
                  value={articleSummary}
                  onChange={(e) => setArticleSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Isi Lengkap Artikel / Naskah Jurnal *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan naskah lengkap berita atau publikasi ilmiah..."
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#5B4FA8] hover:bg-purple-800 font-bold text-white shadow-md cursor-pointer"
                >
                  {editingArticle ? "Simpan Perubahan Publikasi" : "Terbitkan Publikasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboardModal;
