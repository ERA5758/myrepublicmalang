import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';
import type { Offer, OfferTV } from './definitions';

type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/blog", label: "Blog"},
  { href: "/register", label: "Daftar" },
  { href: "/coverage-areas", label: "Area Jangkauan" },
  { href: "/personalized-offers", label: "Rekomendasi" },
];


export const offers: Offer[] = [
  {
    id: "value",
    title: "VALUE",
    speed: "30 Mbps",
    price: "Rp 227.550/bln",
    promo: "Free Upgrade 3 Bulan 50 Mbps",
    features: ["Internet Simetris 1:1", "Unlimited Kuota", "Tahan Cuaca Ekstrim"],
    image: PlaceHolderImages.find(img => img.id === 'basic-connect')!,
  },
  {
    id: "fast",
    title: "FAST",
    speed: "100 Mbps",
    price: "Rp 260.850/bln",
    promo: "Upgrade dari 50 Mbps",
    features: ["Internet Stabil", "Unlimited Kuota", "100% Full Fiber Optic"],
    image: PlaceHolderImages.find(img => img.id === 'family-stream')!,
  },
  {
    id: "nova",
    title: "NOVA",
    speed: "100 Mbps",
    price: "Rp 333.000/bln",
    promo: "Free Upgrade 3 Bulan 249 Mbps",
    features: ["Cocok untuk streaming & kerja", "Unlimited Kuota", "Kecepatan Simetris"],
    image: PlaceHolderImages.find(img => img.id === 'hero-bg')!,
  },
  {
    id: "mygamer",
    title: "MYGAMER",
    speed: "250 Mbps",
    price: "Rp 444.000/bln",
    promo: "Free Upgrade 3 Bulan 399 Mbps",
    features: ["Latensi Terendah untuk Gaming", "Prioritas Jaringan Game", "Internet Super Cepat"],
    image: PlaceHolderImages.find(img => img.id === 'gamer-pro')!,
  },
  {
    id: "prime",
    title: "PRIME",
    speed: "500 Mbps",
    price: "Rp 555.000/bln",
    features: ["Kecepatan Maksimal", "Untuk Kebutuhan Profesional", "Performa Terbaik"],
    image: PlaceHolderImages.find(img => img.id === 'blog-1')!,
  },
];

export const offersTV: OfferTV[] = [
  {
    id: "value-tv",
    title: "VALUE",
    speed: "30 Mbps",
    price: "Rp 320.000/bln",
    promo: "Gratis Upgrade Speed 50 Mbps",
    features: ["Vidio Platinum FREE 12 BULAN", "Genflix FREE 12 BULAN", "Internet UNLIMITED", "Include ONT/Modem", "Gratis Instalasi Rp500,000", "Ideal untuk 1 - 3 Device", "DL & UL 1:1 up to 30 Mbps"],
    image: PlaceHolderImages.find(img => img.id === 'basic-connect')!,
    channels: "65 Channel",
    stb: "Termasuk STB Android 12",
  },
  {
    id: "fast-tv",
    title: "FAST",
    speed: "50 Mbps",
    price: "Rp 335.000/bln",
    promo: "Gratis Upgrade Speed 100 Mbps",
    features: ["Vidio Platinum FREE 12 BULAN", "Genflix FREE 12 BULAN", "Internet UNLIMITED", "Include ONT/Modem", "Gratis Instalasi Rp500,000", "Ideal untuk 1 - 5 Device", "DL & UL 1:1 up to 50 Mbps"],
    image: PlaceHolderImages.find(img => img.id === 'family-stream')!,
    channels: "76 Channel",
    stb: "Termasuk STB Android 12",
  },
  {
    id: "nova-tv",
    title: "NOVA",
    speed: "100 Mbps",
    price: "Rp 385.000/bln",
    promo: "Gratis Upgrade Speed 249 Mbps",
    features: ["Vidio Platinum FREE 12 BULAN", "Genflix FREE 12 BULAN", "Internet UNLIMITED", "Include ONT/Modem", "Gratis Instalasi Rp500,000", "Ideal untuk 1 - 7 Device", "DL & UL 1:1 up to 100 Mbps"],
    image: PlaceHolderImages.find(img => img.id === 'hero-bg')!,
    channels: "76 Channel",
    stb: "Termasuk STB Android 12",
  },
  {
    id: "mygamer-tv",
    title: "MYGAMER",
    speed: "250 Mbps",
    price: "Rp 485.000/bln",
    promo: "Gratis Upgrade Speed 399 Mbps",
    features: ["Vidio Platinum FREE 12 BULAN", "Genflix FREE 12 BULAN", "Internet UNLIMITED", "Include ONT/Modem", "IP Public Static", "Gratis Instalasi Rp500,000", "DL & UL 1:1 up to 250 Mbps", "Ideal untuk 1 - 10 Device", "Akses langsung ke server game"],
    image: PlaceHolderImages.find(img => img.id === 'gamer-pro')!,
    channels: "76 Channel",
    stb: "Termasuk STB ANDROID 12",
  },
  {
    id: "prime-tv",
    title: "PRIME",
    speed: "500 Mbps",
    price: "Rp 585.000/bln",
    features: ["Vidio Platinum FREE 12 BULAN", "Genflix FREE 12 BULAN", "Internet UNLIMITED", "Include ONT/Modem", "Gratis Instalasi Rp500,000", "DL & UL 1:1 up to 500 Mbps", "Ideal untuk 1 - 15 Device"],
    image: PlaceHolderImages.find(img => img.id === 'blog-1')!,
    channels: "76 Channel",
    stb: "Termasuk STB ANDROID 12",
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
    answer: "Anda dapat mengunjungi halaman 'Area Jangkauan' kami untuk melihat daftar lengkap semua area yang telah tercover jaringan MyRepublic. Cukup cari nama kelurahan atau area Anda untuk memeriksa ketersediaan.",
  },
  {
    question: "Paket apa saja yang tersedia?",
    answer: "Kami menawarkan berbagai paket untuk memenuhi kebutuhan dan anggaran yang berbeda, dari paket Value kami untuk browsing sehari-hari hingga paket MyGamer kami untuk game online kompetitif. Anda dapat melihat penawaran unggulan kami di beranda.",
  },
  {
    question: "Bagaimana cara mendapatkan rekomendasi yang dipersonalisasi?",
    answer: "Gunakan halaman 'Rekomendasi' berbasis AI kami! Dengan memberikan alamat Anda dan menjelaskan penggunaan internet Anda, AI kami akan menyarankan paket terbaik yang disesuaikan khusus untuk Anda.",
  }
];
