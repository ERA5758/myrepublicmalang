'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ViewLeadsPage() {
    return (
        <div className="container mx-auto max-w-7xl py-12 sm:py-16">
             <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    Daftar Pendaftar (Leads)
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Halaman ini akan menampilkan daftar semua pendaftar yang masuk melalui formulir di situs web.
                </p>
                <Button asChild variant="link" className="p-0 mt-2">
                    <Link href="/admin">Kembali ke dasbor</Link>
                </Button>
            </div>
             {/* TODO: Implement a table to view leads from Firestore */}
        </div>
    );
}
