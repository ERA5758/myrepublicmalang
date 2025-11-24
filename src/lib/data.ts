import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/blog", label: "Blog"},
  { href: "/register", label: "Daftar" },
  { href: "/coverage-check", label: "Peta Jangkauan" },
  { href: "/coverage-areas", label: "Area Jangkauan" },
  { href: "/personalized-offers", label: "Rekomendasi" },
];

type Offer = {
  id: string;
  title: string;
  price: string;
  speed: string;
  features: string[];
  image: ImagePlaceholder | undefined;
  promo?: string;
};

export const offers: Offer[] = [
  {
    id: "value",
    title: "VALUE",
    speed: "30 Mbps",
    price: "Rp 227.550/bln",
    promo: "Free Upgrade 3 Bulan 50 Mbps",
    features: ["Internet Simetris 1:1", "Unlimited Kuota", "Tahan Cuaca Ekstrim"],
    image: PlaceHolderImages.find(img => img.id === 'basic-connect'),
  },
  {
    id: "fast",
    title: "FAST",
    speed: "100 Mbps",
    price: "Rp 260.850/bln",
    promo: "Upgrade dari 50 Mbps",
    features: ["Internet Stabil", "Unlimited Kuota", "100% Full Fiber Optic"],
    image: PlaceHolderImages.find(img => img.id === 'family-stream'),
  },
  {
    id: "nova",
    title: "NOVA",
    speed: "100 Mbps",
    price: "Rp 333.000/bln",
    promo: "Free Upgrade 3 Bulan 249 Mbps",
    features: ["Cocok untuk streaming & kerja", "Unlimited Kuota", "Kecepatan Simetris"],
    image: PlaceHolderImages.find(img => img.id === 'hero-bg'),
  },
  {
    id: "mygamer",
    title: "MYGAMER",
    speed: "250 Mbps",
    price: "Rp 444.000/bln",
    promo: "Free Upgrade 3 Bulan 399 Mbps",
    features: ["Latensi Terendah untuk Gaming", "Prioritas Jaringan Game", "Internet Super Cepat"],
    image: PlaceHolderImages.find(img => img.id === 'gamer-pro'),
  },
  {
    id: "prime",
    title: "PRIME",
    speed: "500 Mbps",
    price: "Rp 555.000/bln",
    features: ["Kecepatan Maksimal", "Untuk Kebutuhan Profesional", "Performa Terbaik"],
    image: PlaceHolderImages.find(img => img.id === 'blog-1'),
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