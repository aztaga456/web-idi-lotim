export type DoctorCategory =
  | "Dokter Umum"
  | "Spesialis Penyakit Dalam"
  | "Spesialis Anak"
  | "Spesialis Kandungan & Kebidanan"
  | "Spesialis Bedah"
  | "Spesialis Jantung & Pembuluh Darah"
  | "Spesialis Saraf"
  | "Spesialis Mata"
  | "Spesialis THT-KL"
  | "Dokter Gigi";

export interface PracticePlace {
  id: string;
  name: string;
  type: "dinas" | "pribadi";
  address: string;
  district: string;
  schedule: string;
  mapUrl?: string;
}

export interface Doctor {
  id: string;
  orderNumber: number; // 1 to 50
  username: string; // default: dokter1, dokter2, etc.
  password: string; // default: 1234
  role: "doctor" | "admin"; // can be granted admin access
  name: string;
  title: string;
  gender: "Laki-laki" | "Perempuan";
  category: DoctorCategory;
  specialization: string;
  idiNumber: string;
  strNumber: string;
  sipNumber: string;
  sipExpiryDate: string; // YYYY-MM-DD
  sipDaysLeft: number;
  bio: string;
  photoUrl: string;
  phone: string;
  email: string;
  district: string;
  practicePlaces: PracticePlace[];
  socialLinks: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    website?: string;
  };
  gallery: string[];
  likes: number;
  views: number;
  duesStatus: "lunas" | "menunggak" | "belum_bayar";
  monthsUnpaid: number;
  lastPaymentDate?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: "admin" | "doctor";
  doctorId?: string;
}

export interface BookingSubmission {
  doctorName: string;
  patientName: string;
  phone: string;
  district: string;
  type: "konsultasi" | "booking";
  date: string;
  time: string;
  message: string;
}

export interface Article {
  id: string;
  title: string;
  category: "Berita IDI" | "Jurnal Medis" | "Kesehatan Masyarakat" | "Kegiatan Ilmiah";
  type: "berita" | "jurnal";
  summary: string;
  content: string;
  author: string;
  authorRole?: string;
  date: string;
  thumbnailUrl: string;
  readTime?: string;
  views?: number;
  pdfUrl?: string;
}
