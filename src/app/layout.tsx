import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDI Lombok Timur | Sistem Keanggotaan & Layanan Dokter Terpercaya",
  description:
    "Portal resmi Ikatan Dokter Indonesia (IDI) Cabang Kabupaten Lombok Timur. Temukan dokter spesialis dan umum terdekat di 21 kecamatan, jadwal praktik, legalitas SIP, dan booking konsultasi.",
  keywords: [
    "IDI Lombok Timur",
    "Dokter Lombok Timur",
    "Dokter Selong",
    "RSUD Dr R Soedjono",
    "Cari Dokter Lotim",
    "Dokter Spesialis Anak Lombok Timur",
    "Penyakit Dalam Lombok Timur",
    "Ikatan Dokter Indonesia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-[#F0F5FA] antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
