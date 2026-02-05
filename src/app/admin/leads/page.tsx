
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { type Lead, LeadStatusEnum } from "@/lib/definitions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function LeadSkeleton() {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-9 w-32" /></TableCell>
            <TableCell><Skeleton className="h-9 w-20" /></TableCell>
        </TableRow>
    )
}

function LeadDetailDialog({ lead }: { lead: Lead }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detail Pendaftar: {lead.name}</DialogTitle>
        <DialogDescription>
          Informasi lengkap calon pelanggan yang terdaftar pada {lead.createdAt}.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-muted-foreground">Nama</span>
          <span className="font-medium text-right">{lead.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-muted-foreground">Telepon</span>
          <span className="font-medium text-right">{lead.phone}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-muted-foreground">Email</span>
          <span className="font-medium text-right">{lead.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-muted-foreground">Paket</span>
          <span className="font-medium text-right">{lead.selectedPlan}</span>
        </div>
         <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-muted-foreground">Area</span>
          <span className="font-medium text-right">{lead.area}</span>
        </div>
        <div className="flex flex-col space-y-1 border-b pb-2">
          <span className="font-semibold text-muted-foreground">Alamat</span>
          <span className="font-medium text-right">{lead.address}</span>
        </div>
         {(lead.promos && lead.promos.length > 0) && (
            <div className="flex flex-col space-y-1 border-b pb-2">
                <span className="font-semibold text-muted-foreground">Promo Dipilih</span>
                <div className="flex flex-wrap gap-2 justify-end">
                    {lead.promos.map(promo => (
                        <Badge key={promo} variant="secondary">{promo}</Badge>
                    ))}
                </div>
            </div>
        )}
        {lead.locationPin && (
             <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-muted-foreground">Lokasi GPS</span>
                <Button variant="link" asChild className="p-0 h-auto">
                    <a href={`https://www.google.com/maps?q=${lead.locationPin}`} target="_blank" rel="noopener noreferrer">
                        Lihat di Peta
                    </a>
                </Button>
            </div>
        )}
      </div>
    </DialogContent>
  );
}

const statusColors: Record<Lead['status'], string> = {
    "Proses": "bg-blue-100 text-blue-800 border-blue-200",
    "Done": "bg-green-100 text-green-800 border-green-200",
    "Cancel": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Reject": "bg-red-100 text-red-800 border-red-200",
    "Tidak Cover": "bg-gray-100 text-gray-800 border-gray-200",
};


export default function ViewLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        if (!firestore) return;
        setLoading(true);
        const leadsCollection = collection(firestore, 'leads');
        const q = query(leadsCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedLeads = querySnapshot.docs.map(doc => {
                const data = doc.data();
                let createdAt = 'Tanggal tidak tersedia';
                if (data.createdAt instanceof Timestamp) {
                    createdAt = data.createdAt.toDate().toLocaleString('id-ID', {
                       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                }
                
                const promos = [data.promo_prepaid, data.promo_speed_boost].filter(Boolean);
                
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
                    status: data.status || 'Proses', // Default to 'Proses'
                } as Lead;
            });
            setLeads(fetchedLeads);
            setLoading(false);
        }, (error) => {
            console.error("Gagal mengambil data leads:", error);
            toast({ variant: "destructive", title: "Gagal Mengambil Data", description: "Terjadi kesalahan saat mengambil daftar pendaftar." });
            setLoading(false);
        });

        return () => unsubscribe();

    }, [firestore, toast]);

    const handleUpdateStatus = async (leadId: string, status: Lead['status']) => {
        if (!firestore) return;
        const docRef = doc(firestore, "leads", leadId);
        try {
            await updateDoc(docRef, { status: status });
            toast({
                title: "Status Diperbarui",
                description: `Status pendaftar telah diubah menjadi ${status}.`,
            });
        } catch (error) {
            console.error("Gagal memperbarui status:", error);
            toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Terjadi kesalahan saat mengubah status." });
        }
    };


    const handleDelete = async (leadId: string) => {
        if (!firestore) return;

        try {
            await deleteDoc(doc(firestore, "leads", leadId));
            toast({ title: "Sukses!", description: "Data pendaftar telah dihapus." });
        } catch (error) {
            console.error("Gagal menghapus lead:", error);
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus data." });
        }
    };


    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}>
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
                                    <TableHead>Progres</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
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
                                            </TableCell>
                                            <TableCell>{lead.selectedPlan}</TableCell>
                                            <TableCell>
                                                <div className="font-medium line-clamp-2">{lead.address}</div>
                                                <div className="text-sm text-muted-foreground">{lead.area}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={lead.status} onValueChange={(value: Lead['status']) => handleUpdateStatus(lead.id, value)}>
                                                    <SelectTrigger className={cn("w-32 border-2", statusColors[lead.status])}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {LeadStatusEnum.options.map(status => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Lihat Detail</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Hapus</span>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini akan menghapus data pendaftar <strong className="font-bold">{lead.name}</strong> secara permanen. Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(lead.id)}>Hapus</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Belum ada pendaftar yang masuk.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
            {selectedLead && <LeadDetailDialog lead={selectedLead} />}
        </Dialog>
    );
}
