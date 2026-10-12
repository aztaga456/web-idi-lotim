"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Eye,
  FileText,
  Search,
  X,
  Sparkles,
  Share2,
  Bookmark,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Article } from "../types";

interface NewsSectionProps {
  articles: Article[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<string>("all");
  const [catalogSearch, setCatalogSearch] = useState("");

  if (!articles || articles.length === 0) return null;

  // The featured big article (left side)
  const featuredArticle = articles[0];

  // The 5 list items on the right
  const sideArticles = articles.slice(1, 6);

  // Filtered list for the "Lihat Selengkapnya" modal catalog
  const filteredCatalog = articles.filter((art) => {
    const matchCategory =
      catalogFilter === "all"
        ? true
        : catalogFilter === "berita"
        ? art.type === "berita"
        : art.type === "jurnal";
    const matchSearch =
      art.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      art.author.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section id="berita" className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Publikasi Medis & Kabar Organisasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Berita Terkini & Jurnal Medis
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Informasi kegiatan profesi kedokteran, edukasi kesehatan masyarakat, serta riset klinis anggota IDI Cabang Kabupaten Lombok Timur.
            </p>
          </div>

          <button
            onClick={() => setIsCatalogOpen(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5B4FA8] hover:text-purple-800 transition-colors self-start md:self-end group"
          >
            <span>Arsip Publikasi Lengkap</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Main Grid: Left Featured Thumbnail (7 cols) & Right List 5 items (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Featured Big Thumbnail Card (Col 7) */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setSelectedArticle(featuredArticle)}
              className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-7 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full"
            >
              {/* Big Featured Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 bg-slate-100">
                <Image
                  src={featuredArticle.thumbnailUrl}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Badges on top of Image */}
                <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                      featuredArticle.type === "jurnal"
                        ? "bg-[#5B4FA8]"
                        : "bg-teal-600"
                    }`}
                  >
                    {featuredArticle.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{featuredArticle.date}</span>
                  </span>
                </div>

                {featuredArticle.readTime && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/70 backdrop-blur-md text-white shadow-sm flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-200">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{featuredArticle.author}</p>
                      <p className="text-[10px] text-slate-400">{featuredArticle.authorRole || "Kontributor IDI"}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-sky-600 shadow-sm group-hover:shadow-md transition-all">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: List of 5 items with small thumbnails (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            <div className="space-y-3">
              {sideArticles.map((article, idx) => (
                <div
                  key={article.id || idx}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex gap-3.5 sm:gap-4 items-center group"
                >
                  {/* Small Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={article.thumbnailUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold text-white ${
                        article.type === "jurnal" ? "bg-[#5B4FA8]" : "bg-teal-600"
                      }`}
                    >
                      {article.type === "jurnal" ? "Jurnal" : "Berita"}
                    </span>
                  </div>

                  {/* Item Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="text-teal-700 font-semibold truncate">{article.category}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 truncate">
                      Oleh: {article.author}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                </div>
              ))}
            </div>

            {/* Bottom Button "Lihat Selengkapnya" */}
            <div className="pt-2">
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-teal-50 border-2 border-dashed border-teal-300 hover:border-teal-500 text-teal-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all group"
              >
                <span>Lihat Selengkapnya ({articles.length} Publikasi & Riset)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: DETAIL ARTIKEL / JURNAL LENGKAP */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl sm:rounded-4xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-white ${
                    selectedArticle.type === "jurnal" ? "bg-[#5B4FA8]" : "bg-teal-600"
                  }`}
                >
                  {selectedArticle.category}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                </span>
                {selectedArticle.readTime && (
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedArticle.readTime}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h3>

              <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#5B4FA8] font-bold flex items-center justify-center border border-purple-200">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-800">{selectedArticle.author}</strong>
                  <p className="text-[11px] text-slate-400">{selectedArticle.authorRole || "Ikatan Dokter Indonesia Cabang Lombok Timur"}</p>
                </div>
              </div>
            </div>

            {/* Large Cover Photo */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <Image
                src={selectedArticle.thumbnailUrl}
                alt={selectedArticle.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Summary Callout Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs sm:text-sm text-teal-900 font-medium leading-relaxed italic">
              &quot;{selectedArticle.summary}&quot;
            </div>

            {/* Full Content Text */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line border-t border-slate-100 pt-5">
              {selectedArticle.content}
            </div>

            {/* Footer action buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Publikasi Resmi IDI Cabang Kab. Lombok Timur
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KATALOG LENGKAP SEMUA BERITA & JURNAL */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl sm:rounded-4xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  <span>Katalog Berita & Jurnal Medis IDI</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arsip publikasi ilmiah dan berita kegiatan Ikatan Dokter Indonesia Lombok Timur
                </p>
              </div>

              <button
                onClick={() => setIsCatalogOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 text-xs font-bold">
                <button
                  onClick={() => setCatalogFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    catalogFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua ({articles.length})
                </button>
                <button
                  onClick={() => setCatalogFilter("berita")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    catalogFilter === "berita" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Berita IDI
                </button>
                <button
                  onClick={() => setCatalogFilter("jurnal")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    catalogFilter === "jurnal" ? "bg-white text-[#5B4FA8] shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Jurnal Medis
                </button>
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Cari judul, penulis, topik..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            {/* Grid of articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedArticle(item);
                    setIsCatalogOpen(false);
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white ${
                        item.type === "jurnal" ? "bg-[#5B4FA8]" : "bg-teal-600"
                      }`}
                    >
                      {item.type === "jurnal" ? "Jurnal" : "Berita"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="text-teal-700 truncate">{item.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug mt-1">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-1">
                      Oleh: {item.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredCatalog.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Tidak ada berita atau jurnal yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
export default NewsSection;
