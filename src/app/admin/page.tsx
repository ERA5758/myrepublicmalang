'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        if(auth) {
            await signOut(auth);
            router.push('/login');
        }
    };

    return (
        <div className="container mx-auto max-w-7xl py-12 sm:py-16">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                        Panel Admin
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Selamat datang kembali, {user?.email || 'Admin'}.
                    </p>
                </div>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/packages" passHref>
                    <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Kelola Paket</CardTitle>
                            <CardDescription>Ubah detail paket internet yang ditawarkan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center text-sm text-primary">
                                Pergi ke Pengelola Paket
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/blog" passHref>
                    <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Buat Konten Blog</CardTitle>
                            <CardDescription>Gunakan AI untuk membuat artikel blog baru.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-primary">
                                Pergi ke Penulis Blog AI
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/leads" passHref>
                    <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Lihat Pendaftar</CardTitle>
                            <CardDescription>Tinjau daftar pendaftar baru.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center text-sm text-primary">
                                Lihat Daftar Pendaftar
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/admin/reviews" passHref>
                    <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle>Kelola Ulasan</CardTitle>
                            <CardDescription>Setujui atau tolak ulasan dari pelanggan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center text-sm text-primary">
                                Pergi ke Manajemen Ulasan
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
