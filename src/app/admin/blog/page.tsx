'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogCreatorPage() {
    return (
        <div className="container mx-auto max-w-7xl py-12 sm:py-16">
             <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    Pembuat Konten Blog AI
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Halaman ini akan berisi alat untuk membuat artikel blog baru menggunakan kecerdasan buatan.
                </p>
                <Button asChild variant="link" className="p-0 mt-2">
                    <Link href="/admin">Kembali ke dasbor</Link>
                </Button>
            </div>
             {/* TODO: Implement AI blog post generator */}
        </div>
    );
}
