'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    area: string;
    address: string;
    selectedPlan: string;
    locationPin: string;
    createdAt: string;
    promo_prepaid?: string;
    promo_pos?: string;
};

function LeadSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
    )
}

export default function ViewLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        if (!firestore) return;

        async function fetchLeads() {
            setLoading(true);
            try {
                const leadsCollection = collection(firestore, 'leads');
                const q = query(leadsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const fetchedLeads = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    let createdAt = 'Tanggal tidak tersedia';
                    if (data.createdAt instanceof Timestamp) {
                        createdAt = data.createdAt.toDate().toLocaleString('id-ID', {
                           year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                    }
                    
                    const promos = [data.promo_prepaid, data.promo_pos].filter(Boolean);
                    
                    return {
                        id: doc.id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        area: data.area,
                        address: data.address,
                        selectedPlan: data.selectedPlan,
                        locationPin: data.locationPin,
                        createdAt: createdAt,
                        promos: promos,
                    } as Lead;
                });
                setLeads(fetchedLeads);
            } catch (error) {
                console.error("Gagal mengambil data leads:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeads();
    }, [firestore]);


    return (
        <div className="container mx-auto max-w-7xl py-12 sm:py-16">
             <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    Daftar Pendaftar (Leads)
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Berikut adalah daftar semua calon pelanggan yang masuk melalui formulir di situs web.
                </p>
                <Button asChild variant="link" className="p-0 mt-2">
                    <Link href="/admin">Kembali ke dasbor</Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Pendaftar Terbaru</CardTitle>
                    <CardDescription>Diurutkan dari yang paling baru.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Kontak</TableHead>
                                <TableHead>Paket</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Promo Dipilih</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <>
                                    <LeadSkeleton />
                                    <LeadSkeleton />
                                    <LeadSkeleton />
                                </>
                            ) : leads.length > 0 ? (
                                leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium">{lead.createdAt}</TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{lead.name}</div>
                                            <div className="text-sm text-muted-foreground">{lead.phone}</div>
                                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                                        </TableCell>
                                        <TableCell>{lead.selectedPlan}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{lead.address}</div>
                                            <div className="text-sm text-muted-foreground">{lead.area}</div>
                                            {lead.locationPin && (
                                                <a href={`https://www.google.com/maps?q=${lead.locationPin}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                                                    Lihat di Peta
                                                </a>
                                            )}
                                        </TableCell>
                                         <TableCell>
                                            <div className="flex flex-col gap-2">
                                            {(lead.promos && lead.promos.length > 0) ? lead.promos.map((promo: string) => (
                                                <Badge key={promo} variant="secondary">{promo}</Badge>
                                            )) : <span className="text-xs text-muted-foreground">-</span>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Belum ada pendaftar yang masuk.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
