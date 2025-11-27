
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';
import type { Offer, OfferTV, AddOn, CarouselSlide } from './definitions';

type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/reviews", label: "Ulasan" },
  { href: "/blog", label: "Blog"},
  { href: "/compare", label: "Bandingkan" },
  { href: "/register", label: "Daftar" },
  { href: "/cek-area", label: "Cek Area" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
  { href: "/personalized-offers", label: "Rekomendasi" },
  { href: "/speed-test", label: "Speed Test" },
];


export const offers: Offer[] = [
  {
    id: "jet-20mbps",
    title: "JET",
    speed: "20 Mbps",
    price: "Rp 164.280/bln",
    promo: "Promo Bayar 12 Bulan Gratis 3 Bulan",
    features: ["Setara Rp164rb-an/bulan", "Internet Simetris 1:1", "Unlimited Kuota", "Tahan Cuaca Ekstrim"],
    image: {
      "id": "promo-12get3",
      "description": "Promo internet MyRepublic bayar 1 tahun gratis 3 bulan",
      "imageUrl": "https://picsum.photos/seed/promo12get3/800/600",
      "imageHint": "internet promo"
    }
  },
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
    id: "jet-20mbps-tv",
    title: "JET",
    speed: "20 Mbps",
    price: "Rp 239.760/bln",
    promo: "Promo Bayar 12 Bulan Gratis 3 Bulan",
    features: ["Setara Rp239rb-an/bulan", "Gratis Vidio Platinum & Genflix", "Internet UNLIMITED", "Tahan Cuaca"],
    image: {
      "id": "promo-12get3-tv",
      "description": "Promo internet dan TV MyRepublic bayar 1 tahun gratis 3 bulan",
      "imageUrl": "https://picsum.photos/seed/promo12get3tv/800/600",
      "imageHint": "tv promo"
    },
    channels: "76 Channel",
    stb: "Termasuk STB Android 12"
  },
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

export const addOns: AddOn[] = [
  // Perangkat
  { id: "addon-router-plus", category: "perangkat", title: "Router Plus", description: "Wi-Fi single band 2,4 GHz", price: "Rp 13.636 / Bulan" },
  { id: "addon-ip-static", category: "perangkat", title: "IP Public Static V4", description: "Akses perangkat dari manapun", price: "Rp 25.000 / Bulan" },
  { id: "addon-router-pro", category: "perangkat", title: "Router Pro", description: "Wi-Fi dual band 2,4 dan 5 GHz", price: "Rp 40.000 / Bulan" },
  { id: "addon-wifi-mesh", category: "perangkat", title: "Wifi Mesh", description: "Dua Wi-Fi Router yang terhubung secara nirkabel", price: "Rp 80.000 / Bulan" },
  // TV
  { id: "addon-tv-entertainment", category: "tv", title: "TV Entertainment", price: "Rp 15.000 / Bulan", notes: "Termasuk paket Value30 keatas", features: ["Lifetime", "Rock Entertainment", "Rock Action"] },
  { id: "addon-tv-knowledge", category: "tv", title: "TV Knowledge & Lifestyle", price: "Rp 15.000 / Bulan", notes: "Termasuk paket Value30 keatas", features: ["afn", "BBC Lifestyle", "HGTV", "History", "Love Nature 4K"] },
  { id: "addon-tv-movies", category: "tv", title: "TV Movies", price: "Rp 20.000 / Bulan", notes: "Termasuk paket FAST50 keatas", features: ["Galaxy Premium", "IMC", "Zeebioskop"] },
  // Smart Home
  { id: "addon-sh-lite", category: "smart-home", title: "Smart Security Lite Plus", description: "Perangkat yang didapatkan:\n1x Indoor CCTV IP PTZ X Rabit\n1x SD Card 64Gb", price: "Rp 335.000", oldPrice: "Rp 385.765", discount: "-14%", features: ["AI Auto Tracking", "Image Sensor: 1/2.9″ Color CMOS", "Lens Type: FHD, 2MP", "Viewing Angle: 105°", "Nightvision: IR-Cut Autoswitch", "Video Resolution: 1920*1080", "Audio: Built-in Mic & Speaker", "Wi-Fi: IEEE 802.11 b/g/n 2.4GHz", "Cloud Storage: Support", "Terhubung dengan aplikasi Rabit"] },
  { id: "addon-sh-pro", category: "smart-home", title: "Smart Security Pro Plus", description: "Perangkat yang didapatkan:\n1x Indoor CCTV IP PTZ Screen Rabit\n1x SD Card 64Gb", price: "Rp 475.000", oldPrice: "Rp 538.918", discount: "-12%", features: ["AI Auto Tracking", "Image Sensor: 1/2.9″ Color CMOS", "Lens Type: FHD, 2MP", "Viewing Angle: 100°", "Nightvision: IR-Cut Autoswitch", "Video Resolution: 1920*1080", "Audio: Built-in Mic & Speaker", "Wi-Fi: IEEE 802.11 b/g/n 2.4GHz", "Cloud Storage: Support", "2 Way Video Call Screen", "Terhubung dengan aplikasi Rabit"] },
  { id: "addon-sh-starter", category: "smart-home", title: "Smart Home Starter Pack", description: "Perangkat yang didapatkan:\n1x Smart Light Bulb Color 10W Bluetooth\n1x Smart Plug 2 in 1 +Bluetooth Gateway\n1x Universal IR Remote Control (WiFi)", price: "Rp 245.000", oldPrice: "Rp 286.756", discount: "-15%", features: ["Smart Light Bulb: Color Temp: 2700K – 6500K", "Smart Light Bulb: Power 10 Watt", "Smart Plug: Power: 3680 W", "Smart Plug: Ampere: 16 A", "Smart Plug: Voltage: 230 V", "Universal IR Remote Control: WiFi: 802.11 b/g/n 2.4 Ghz", "Universal IR Remote Control: Jarak Infra Red: ≤ 8 Meter"] },
  // Speed Booster
  { id: "addon-speed-40", category: "speed-booster", title: "Speed Upgrade to 40Mbps", description: "Khusus Untuk Paket Value30", price: "Rp 10.000 / Bulan" },
  { id: "addon-speed-75", category: "speed-booster", title: "Speed Upgrade to 75Mbps", description: "Khusus Untuk Paket Fast50", price: "Rp 25.000 / Bulan" },
  { id: "addon-speed-150", category: "speed-booster", title: "Speed Upgrade to 150Mbps", description: "Khusus Untuk Paket Nova100", price: "Rp 45.000 / Bulan" },
  { id: "addon-speed-325", category: "speed-booster", title: "Speed Upgrade to 325Mbps", description: "Khusus Untuk Paket MyGamer250", price: "Rp 55.000 / Bulan" },
];

export const carouselSlides: CarouselSlide[] = [
    {
      id: 'hero-carousel-1',
      title: 'Rasakan Masa Depan Internet',
      description: 'Kecepatan super cepat, data tanpa batas, dan keandalan tak tertandingi. Bergabunglah dengan jaringan MyRepublic dan tingkatkan kehidupan digital Anda. GRATIS INSTALASI!',
      image: PlaceHolderImages.find(img => img.id === 'hero-carousel-1')!
    },
    {
      id: 'hero-carousel-2',
      title: 'Gaming Tanpa Kompromi',
      description: 'Latensi rendah dan jaringan prioritas untuk para gamer. Dominasi setiap pertandingan dengan paket MyGamer kami.',
      image: PlaceHolderImages.find(img => img.id === 'hero-carousel-2')!
    },
    {
      id: 'hero-carousel-3',
      title: 'Hiburan Tanpa Batas untuk Keluarga',
      description: 'Streaming film 4K dan nikmati tayangan TV favorit tanpa buffer. Paket combo TV kami hadir untuk hiburan keluarga terbaik.',
      image: PlaceHolderImages.find(img => img.id === 'hero-carousel-3')!
    }
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
    answer: "Anda dapat mengunjungi halaman 'Cek Area' kami untuk melihat daftar lengkap semua area yang telah tercover jaringan MyRepublic. Cukup cari nama kelurahan atau area Anda untuk memeriksa ketersediaan.",
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

    

    

