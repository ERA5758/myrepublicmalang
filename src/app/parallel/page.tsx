
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import type { ParallelPackage } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Zap, 
    Users, 
    ShieldCheck, 
    MessageSquare, 
    TrendingDown, 
    Globe, 
    CircleCheck,
    ArrowRight,
    Home,
    Building2
} from 'lucide-react';

export default function ParallelLandingPage() {
    const [packages, setPackages] = useState<ParallelPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        async function fetchParallelPackages() {
            if (!firestore) return;
            try {
                const parallelCollection = collection(firestore, 'parallelPackages');
                const snapshot = await getDocs(query(parallelCollection));
                const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParallelPackage));
                setPackages(fetched);
            } catch (error) {
                console.error("Error fetching parallel packages:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchParallelPackages();
    }, [firestore]);

    const handleWhatsAppChat = (packageName: string) => {
        const message = `Halo, saya tertarik dengan program [Parallel Hemat: ${packageName}]. Bisa bantu cek area di lokasi saya?`;
        window.open(`https://wa.me/6285184000800?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative flex min-h-[90vh] items-center justify-center bg-slate-50 py-20 lg:py-32">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-500 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-purple-500 blur-[120px]" />
                </div>
                
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <Badge className="mb-6 border-orange-200 bg-orange-100 px-4 py-1 text-orange-700 hover:bg-orange-100">
                        <TrendingDown className="mr-2 h-4 w-4" /> Internet Cepat, Harga Tetangga
                    </Badge>
                    <h1 className="mx-auto mb-8 max-w-4xl font-headline text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                        Nikmati Internet <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Premium</span> Dengan Harga Kolektif
                    </h1>
                    <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-600 sm:text-xl">
                        Solusi internet fiber 100% Unlimited tanpa FUP untuk perumahan dan kost-kostan. Lebih hemat, lebih stabil, dan dikelola langsung oleh tim sales ahli.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="h-14 rounded-full bg-orange-600 px-10 text-lg font-bold transition-transform hover:scale-105" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                            Lihat Paket Hemat
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 rounded-full border-2 px-10 text-lg font-bold" asChild>
                            <a href="https://wa.me/6285184000800" target="_blank">Konsultasi Gratis</a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="bg-white py-24 border-y">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-colors hover:bg-slate-50">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Sistem Kolektif</h3>
                            <p className="text-slate-600 text-sm">Cukup ajak teman kost atau tetangga Anda untuk berlangganan bersama dan nikmati harga yang jauh lebih murah.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-colors hover:bg-slate-50">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Performa Simetris</h3>
                            <p className="text-slate-600 text-sm">Kecepatan Upload dan Download sama cepat (1:1). Sangat cocok untuk gaming, kerja remote, dan sekolah online.</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl transition-colors hover:bg-slate-50">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">After-Sales Cepat</h3>
                            <p className="text-slate-600 text-sm">Layanan bantuan langsung melalui Sales Executive. Respon lebih cepat, tanpa perlu antre di customer service pusat.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section id="packages" className="bg-slate-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="font-headline text-4xl font-bold text-slate-900 sm:text-5xl">Pilih Paket Parallel Anda</h2>
                        <p className="mt-4 text-slate-600 italic font-medium">Khusus area yang terjangkau jaringan MyRepublic</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="h-[500px] w-full animate-pulse rounded-3xl bg-slate-200" />
                            ))
                        ) : (
                            packages.map((pkg, index) => (
                                <Card key={pkg.id} className="group relative overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl transition-all hover:-translate-y-2">
                                    {/* Design Accents */}
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {index === 0 ? <Building2 size={120} /> : <Home size={120} />}
                                    </div>
                                    
                                    <CardContent className="p-0">
                                        <div className="bg-orange-600 p-10 text-white">
                                            <Badge className="mb-4 bg-white/20 text-white border-none backdrop-blur-sm">Budget Friendly</Badge>
                                            <h3 className="font-headline text-3xl font-extrabold">{pkg.title}</h3>
                                            <p className="mt-2 text-orange-100">{pkg.requirement}</p>
                                        </div>
                                        
                                        <div className="p-10">
                                            <div className="mb-8 flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                                                <span className="text-slate-500">/bulan</span>
                                            </div>

                                            <div className="space-y-4 mb-10">
                                                {pkg.features.map((feature, fIndex) => (
                                                    <div key={fIndex} className="flex items-start gap-3">
                                                        <CircleCheck className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                        <span className="text-sm text-slate-600">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button 
                                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-orange-600 transition-colors"
                                                onClick={() => handleWhatsAppChat(pkg.title)}
                                            >
                                                Hubungi Sales (Cek Area)
                                                <MessageSquare className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    <div className="mt-16 text-center">
                         <p className="text-sm text-slate-500 bg-white inline-block px-6 py-3 rounded-full border shadow-sm">
                            <ShieldCheck className="inline-block mr-2 h-4 w-4 text-orange-500" />
                            <strong>PENTING:</strong> Paket Parallel dikelola khusus oleh Sales, bukan via kantor pusat.
                        </p>
                    </div>
                </div>
            </section>

            {/* How to join section */}
            <section className="bg-slate-900 py-24 text-white">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="font-headline text-4xl font-bold">Cara Mudah Berlangganan</h2>
                        <p className="mt-4 text-slate-400">Proses pendaftaran dibantu penuh sampai aktif.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-orange-500 font-bold text-2xl border border-slate-700">1</div>
                            <h4 className="font-bold">Kumpulkan Teman</h4>
                            <p className="text-xs text-slate-400">Ajak minimal 3 kamar kost atau 2 rumah terdekat.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-orange-500 font-bold text-2xl border border-slate-700">2</div>
                            <h4 className="font-bold">Verifikasi Area</h4>
                            <p className="text-xs text-slate-400">Hubungi sales untuk cek ketersediaan jaringan di titik lokasi.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-orange-500 font-bold text-2xl border border-slate-700">3</div>
                            <h4 className="font-bold">Registrasi Cepat</h4>
                            <p className="text-xs text-slate-400">Kirim data diri kolektif ke sales executive kami.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-orange-500 font-bold text-2xl border border-slate-700">4</div>
                            <h4 className="font-bold">Pemasangan</h4>
                            <p className="text-xs text-slate-400">Teknisi datang dan internet siap digunakan!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-orange-600 py-20 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-20">
                    <Globe size={400} />
                </div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h2 className="mb-6 font-headline text-4xl font-bold">Sudah Siap Upgrade Internet Anda?</h2>
                    <p className="mb-10 text-xl text-orange-100">Dapatkan harga promo khusus hari ini dan nikmati koneksi tanpa batas.</p>
                    <Button size="lg" className="h-16 rounded-full bg-white px-12 text-lg font-extrabold text-orange-600 hover:bg-slate-100 shadow-2xl" asChild>
                        <a href="https://wa.me/6285184000800" target="_blank">
                            Chat Sales Executive Sekarang
                            <ArrowRight className="ml-2 h-6 w-6" />
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
