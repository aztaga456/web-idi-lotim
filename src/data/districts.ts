export interface DistrictInfo {
  id: string;
  name: string;
  doctorCount: number;
  featuredClinic: string;
}

export const DISTRICTS: DistrictInfo[] = [
  { id: "selong", name: "Selong", doctorCount: 18, featuredClinic: "RSUD Dr. R. Soedjono Selong & RS Islam Namira" },
  { id: "aikmel", name: "Aikmel", doctorCount: 5, featuredClinic: "Puskesmas Aikmel & Klinik Harapan Bersama" },
  { id: "masbagik", name: "Masbagik", doctorCount: 6, featuredClinic: "Puskesmas Masbagik & Praktik Mandiri" },
  { id: "labuhan-haji", name: "Labuhan Haji", doctorCount: 4, featuredClinic: "RSUD Lombok Timur Labuhan Haji" },
  { id: "keruak", name: "Keruak", doctorCount: 3, featuredClinic: "Puskesmas Keruak" },
  { id: "sikur", name: "Sikur", doctorCount: 3, featuredClinic: "Puskesmas Sikur" },
  { id: "pringgabaya", name: "Pringgabaya", doctorCount: 3, featuredClinic: "Puskesmas Pringgabaya & Batuyang" },
  { id: "wanasaba", name: "Wanasaba", doctorCount: 2, featuredClinic: "Puskesmas Wanasaba" },
  { id: "sukamulia", name: "Sukamulia", doctorCount: 2, featuredClinic: "Puskesmas Sukamulia" },
  { id: "terara", name: "Terara", doctorCount: 2, featuredClinic: "Puskesmas Terara" },
  { id: "montong-gading", name: "Montong Gading", doctorCount: 1, featuredClinic: "Puskesmas Montong Betok" },
  { id: "suralaga", name: "Suralaga", doctorCount: 1, featuredClinic: "Puskesmas Suralaga" },
  { id: "sakra", name: "Sakra", doctorCount: 2, featuredClinic: "Puskesmas Sakra" },
  { id: "sakra-barat", name: "Sakra Barat", doctorCount: 1, featuredClinic: "Puskesmas Sakra Barat" },
  { id: "sakra-timur", name: "Sakra Timur", doctorCount: 1, featuredClinic: "Puskesmas Lepak" },
  { id: "jerowaru", name: "Jerowaru", doctorCount: 1, featuredClinic: "Puskesmas Jerowaru" },
  { id: "sambelia", name: "Sambelia", doctorCount: 1, featuredClinic: "Puskesmas Sambelia" },
  { id: "sembalun", name: "Sembalun", doctorCount: 1, featuredClinic: "Puskesmas Sembalun" },
  { id: "suela", name: "Suela", doctorCount: 1, featuredClinic: "Puskesmas Suela" },
  { id: "lenek", name: "Lenek", doctorCount: 1, featuredClinic: "Puskesmas Lenek" },
  { id: "pringgasela", name: "Pringgasela", doctorCount: 1, featuredClinic: "Puskesmas Pringgasela" },
];
