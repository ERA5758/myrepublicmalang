'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
                <Card>
                    <CardHeader>
                        <CardTitle>Kelola Paket</CardTitle>
                        <CardDescription>Ubah detail paket internet yang ditawarkan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Segera hadir: Fitur untuk menambah, mengedit, dan menghapus paket internet.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Buat Konten Blog</CardTitle>
                        <CardDescription>Gunakan AI untuk membuat artikel blog baru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Segera hadir: Generator artikel blog berbasis AI untuk strategi konten Anda.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Lihat Pendaftar</CardTitle>
                        <CardDescription>Tinjau daftar pendaftar baru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p>Segera hadir: Tampilan daftar prospek yang mendaftar melalui website.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
