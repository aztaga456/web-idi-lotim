import { DoctorCategory } from "../types";

export interface CategoryItem {
  id: string;
  name: DoctorCategory;
  shortName: string;
  count: number;
  iconName: string;
  color: string;
  description: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "umum",
    name: "Dokter Umum",
    shortName: "Dokter Umum",
    count: 22,
    iconName: "Stethoscope",
    color: "from-blue-500 to-cyan-500",
    description: "Pelayanan kesehatan tingkat pertama, pencegahan, dan rujukan awal.",
  },
  {
    id: "anak",
    name: "Spesialis Anak",
    shortName: "Spesialis Anak (Sp.A)",
    count: 6,
    iconName: "Baby",
    color: "from-purple-500 to-indigo-500",
    description: "Kesehatan tumbuh kembang bayi, imunisasi, dan pengobatan penyakit anak.",
  },
  {
    id: "penyakit-dalam",
    name: "Spesialis Penyakit Dalam",
    shortName: "Penyakit Dalam (Sp.PD)",
    count: 7,
    iconName: "Activity",
    color: "from-emerald-500 to-teal-500",
    description: "Diagnosa dan penanganan penyakit organ dalam pada pasien dewasa dan lansia.",
  },
  {
    id: "kandungan",
    name: "Spesialis Kandungan & Kebidanan",
    shortName: "Kandungan (Sp.OG)",
    count: 5,
    iconName: "HeartHandshake",
    color: "from-rose-500 to-pink-500",
    description: "Pemeriksaan kehamilan, persalinan, USG 4D, dan kesehatan reproduksi wanita.",
  },
  {
    id: "bedah",
    name: "Spesialis Bedah",
    shortName: "Spesialis Bedah (Sp.B)",
    count: 4,
    iconName: "Scissors",
    color: "from-amber-500 to-orange-500",
    description: "Operasi dan penanganan bedah umum serta trauma darurat.",
  },
  {
    id: "jantung",
    name: "Spesialis Jantung & Pembuluh Darah",
    shortName: "Jantung (Sp.JP)",
    count: 2,
    iconName: "HeartPulse",
    color: "from-red-500 to-rose-600",
    description: "Konsultasi kardiologi, EKG, treadmill test, dan rehabilitasi jantung.",
  },
  {
    id: "saraf",
    name: "Spesialis Saraf",
    shortName: "Spesialis Saraf (Sp.S / Sp.N)",
    count: 2,
    iconName: "Brain",
    color: "from-violet-500 to-purple-600",
    description: "Gangguan saraf, stroke, saraf terjepit, vertigo, dan migrain.",
  },
  {
    id: "mata",
    name: "Spesialis Mata",
    shortName: "Spesialis Mata (Sp.M)",
    count: 2,
    iconName: "Eye",
    color: "from-cyan-500 to-blue-600",
    description: "Pemeriksaan refraksi mata, operasi katarak, dan retina.",
  },
];
