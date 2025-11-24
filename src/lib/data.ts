import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/register", label: "Daftar" },
  { href: "/coverage-check", label: "Jangkauan" },
  { href: "/personalized-offers", label: "Rekomendasi" },
];

type Offer = {
  id: string;
  title: string;
  description: string;
  speed: string;
  features: string[];
  image: ImagePlaceholder | undefined;
};

export const offers: Offer[] = [
  {
    id: "gamer-pro",
    title: "Gamer Pro",
    speed: "500 Mbps",
    description: "Dirancang untuk kemenangan dengan latensi sangat rendah dan bandwidth maksimum untuk bermain game dan streaming tanpa hambatan.",
    features: ["Latensi Terendah", "Unggah/Unduh Simetris", "Router Gaming Gratis"],
    image: PlaceHolderImages.find(img => img.id === 'gamer-pro'),
  },
  {
    id: "family-stream",
    title: "Family Stream",
    speed: "300 Mbps",
    description: "Keseimbangan sempurna antara kecepatan dan keandalan untuk seluruh keluarga. Streaming, belajar, dan berselancar di banyak perangkat tanpa lag.",
    features: ["Kuota Tanpa Batas", "Koneksi Stabil", "Hubungkan hingga 15 perangkat"],
    image: PlaceHolderImages.find(img => img.id === 'family-stream'),
  },
  {
    id: "basic-connect",
    title: "Basic Connect",
    speed: "100 Mbps",
    description: "Internet berkecepatan tinggi yang terjangkau untuk kebutuhan harian Anda. Ideal untuk browsing, media sosial, dan streaming dalam HD.",
    features: ["Harga Terbaik", "Fiber Optik Andal", "Dukungan Pelanggan 24/7"],
    image: PlaceHolderImages.find(img => img.id === 'basic-connect'),
  },
];

type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Apa itu MyRepublic?",
    answer: "MyRepublic adalah penyedia internet fiber optik yang menawarkan layanan broadband berkecepatan tinggi. Kami berdedikasi untuk menyediakan internet yang cepat, andal, dan terjangkau bagi penduduk Malang.",
  },
  {
    question: "Apa saja keuntungan internet fiber MyRepublic?",
    answer: "Jaringan fiber optik kami menyediakan kecepatan unggah dan unduh yang simetris, latensi lebih rendah, dan koneksi yang lebih stabil dibandingkan dengan internet kabel tradisional. Ini ideal untuk bermain game, streaming konten 4K, konferensi video, dan mendukung banyak perangkat yang terhubung.",
  },
  {
    question: "Bagaimana cara memeriksa jangkauan di area saya di Malang?",
    answer: "Anda dapat menggunakan alat Cek Jangkauan kami di situs web kami. Cukup masukkan alamat lengkap Anda untuk melihat apakah layanan kami tersedia di lokasi Anda dan jelajahi paket yang tersedia.",
  },
  {
    question: "Paket apa saja yang tersedia?",
    answer: "Kami menawarkan berbagai paket untuk memenuhi kebutuhan dan anggaran yang berbeda, dari paket Basic Connect kami untuk browsing sehari-hari hingga paket Gamer Pro kami untuk game online kompetitif. Anda dapat melihat penawaran unggulan kami di beranda.",
  },
  {
    question: "Bagaimana cara mendapatkan rekomendasi yang dipersonalisasi?",
    answer: "Gunakan Alat Kustomisasi Penawaran Berbasis AI kami! Dengan memberikan alamat Anda dan menjelaskan penggunaan internet Anda, AI kami akan menyarankan paket terbaik yang disesuaikan khusus untuk Anda.",
  }
];
