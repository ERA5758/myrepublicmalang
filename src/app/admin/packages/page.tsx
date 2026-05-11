
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader, PlusCircle, Trash2, Edit } from 'lucide-react';
import type { Offer, OfferTV, ImagePlaceholder, MyGamerPackage, ParallelPackage } from '@/lib/definitions';
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
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';


type PackageType = 'offers' | 'offersTV' | 'myGamerPackages' | 'parallelPackages';
type PackageData = Offer | OfferTV | MyGamerPackage | ParallelPackage;

export default function ManagePackagesPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersTV, setOffersTV] = useState<OfferTV[]>([]);
  const [myGamerPackages, setMyGamerPackages] = useState<MyGamerPackage[]>([]);
  const [parallelPackages, setParallelPackages] = useState<ParallelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [activeTab, setActiveTab] = useState<PackageType>('offers');
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    setLoading(true);

    const offersQuery = query(collection(firestore, 'offers'), orderBy('price'));
    const offersTVQuery = query(collection(firestore, 'offersTV'), orderBy('price'));
    const myGamerQuery = query(collection(firestore, 'myGamerPackages'));
    const parallelQuery = query(collection(firestore, 'parallelPackages'));

    const unsubscribeOffers = onSnapshot(offersQuery, (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer)));
      setLoading(false);
    });

    const unsubscribeOffersTV = onSnapshot(offersTVQuery, (snapshot) => {
      setOffersTV(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfferTV)));
      setLoading(false);
    });

    const unsubscribeMyGamer = onSnapshot(myGamerQuery, (snapshot) => {
      setMyGamerPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MyGamerPackage)));
      setLoading(false);
    });

    const unsubscribeParallel = onSnapshot(parallelQuery, (snapshot) => {
        setParallelPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParallelPackage)));
        setLoading(false);
    });

    return () => {
      unsubscribeOffers();
      unsubscribeOffersTV();
      unsubscribeMyGamer();
      unsubscribeParallel();
    };
  }, [firestore]);

  const handleOpenForm = (pkg: PackageData | null, type: PackageType) => {
    setActiveTab(type);
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, type: PackageType) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, type, id));
      toast({ title: 'Sukses!', description: 'Paket berhasil dihapus.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus paket.' });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Kelola Paket
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
            Tambah, edit, dan hapus paket internet, TV, dan Parallel.
          </p>
           <Button asChild variant="link" className="p-0 mt-2">
                <Link href="/admin">Kembali ke dasbor</Link>
            </Button>
        </div>
        <Button onClick={() => handleOpenForm(null, activeTab)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Paket Baru
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PackageType)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="offers">Internet</TabsTrigger>
          <TabsTrigger value="offersTV">Internet + TV</TabsTrigger>
          <TabsTrigger value="myGamerPackages">MyGamer</TabsTrigger>
          <TabsTrigger value="parallelPackages">Parallel</TabsTrigger>
        </TabsList>
        <TabsContent value="offers">
          <PackageTable packages={offers} onEdit={(pkg: any) => handleOpenForm(pkg, 'offers')} onDelete={(id: string) => handleDelete(id, 'offers')} loading={loading} />
        </TabsContent>
        <TabsContent value="offersTV">
          <PackageTable packages={offersTV} onEdit={(pkg: any) => handleOpenForm(pkg, 'offersTV')} onDelete={(id: string) => handleDelete(id, 'offersTV')} loading={loading} isTVPackage />
        </TabsContent>
         <TabsContent value="myGamerPackages">
          <PackageTable packages={myGamerPackages} onEdit={(pkg: any) => handleOpenForm(pkg, 'myGamerPackages')} onDelete={(id: string) => handleDelete(id, 'myGamerPackages')} loading={loading} isGamerPackage />
        </TabsContent>
        <TabsContent value="parallelPackages">
          <PackageTable packages={parallelPackages} onEdit={(pkg: any) => handleOpenForm(pkg, 'parallelPackages')} onDelete={(id: string) => handleDelete(id, 'parallelPackages')} loading={loading} isParallelPackage />
        </TabsContent>
      </Tabs>
      
      <PackageForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} pkg={editingPackage} type={activeTab} />
    </div>
  );
}

// @ts-ignore
function PackageTable({ packages, onEdit, onDelete, loading, isTVPackage = false, isGamerPackage = false, isParallelPackage = false }) {
    if (loading) return <div className="flex justify-center items-center h-64"><Loader className="h-8 w-8 animate-spin" /></div>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{isGamerPackage ? 'Tier' : 'Nama Paket'}</TableHead>
                    <TableHead>Kecepatan</TableHead>
                    <TableHead>Harga</TableHead>
                    {isTVPackage && <TableHead>Channel</TableHead>}
                    {isParallelPackage && <TableHead>Syarat</TableHead>}
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {packages.map((pkg: any) => (
                    <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{isGamerPackage ? pkg.tier : pkg.title}</TableCell>
                        <TableCell>{pkg.speed}</TableCell>
                        <TableCell>{pkg.price}</TableCell>
                        {isTVPackage && <TableCell>{pkg.channels}</TableCell>}
                        {isParallelPackage && <TableCell>{pkg.requirement}</TableCell>}
                        <TableCell className="text-right">
                             <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(pkg)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Hapus paket?</AlertDialogTitle><AlertDialogDescription>Tindakan ini permanen.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(pkg.id)}>Hapus</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function PackageForm({ isOpen, setIsOpen, pkg, type }: { isOpen: boolean; setIsOpen: (o: boolean) => void; pkg: PackageData | null; type: PackageType; }) {
    const defaultImage = { id: '', imageUrl: '', imageHint: '', description: '' };
    const getInitialFormData = () => {
        if (!isOpen) return {};
        if (pkg) return { ...pkg };
        const base = { id: '', image: { ...defaultImage }, features: [] };
        if (type === 'myGamerPackages') return { ...base, tier: '', speed: '', price: '' };
        if (type === 'offersTV') return { ...base, title: '', speed: '', price: '', promo: '', channels: '', stb: '' };
        if (type === 'parallelPackages') return { ...base, title: '', speed: '', price: '', requirement: '' };
        return { ...base, title: '', speed: '', price: '', promo: '' };
    };
    const [formData, setFormData] = useState<Partial<PackageData>>(getInitialFormData());
    const [formLoading, setFormLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();
    useEffect(() => { setFormData(getInitialFormData()); }, [isOpen, pkg, type]);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name.startsWith('image.')) {
            const field = name.split('.')[1];
            setFormData(p => ({ ...p, image: { ...(p?.image || defaultImage), [field]: value } }));
        } else if (name === 'features') {
            setFormData({ ...formData, [name]: value.split('\n') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!firestore) return;
        setFormLoading(true);
        const data = { ...formData };
        const docId = pkg ? pkg.id : (data.id || (data as any).title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Math.random().toString(36).substr(2, 9));
        data.id = docId;
        try {
            await setDoc(doc(firestore, type, docId), data, { merge: true });
            toast({ title: 'Sukses!', description: 'Paket disimpan.' });
            setIsOpen(false);
        } catch (e) { toast({ variant: 'destructive', title: 'Gagal', description: 'Error saat menyimpan.' }); }
        finally { setFormLoading(false); }
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>{pkg ? 'Edit Paket' : 'Tambah Paket'}</DialogTitle></DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-6">
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        {!pkg && <div className="space-y-1"><Label>ID Paket</Label><Input name="id" value={formData.id || ''} onChange={handleChange} required /></div>}
                        <div className="space-y-1"><Label>{type === 'myGamerPackages' ? 'Tier' : 'Nama Paket'}</Label><Input name={type === 'myGamerPackages' ? 'tier' : 'title'} value={(formData as any).title || (formData as any).tier || ''} onChange={handleChange} required /></div>
                        <div className="space-y-1"><Label>Kecepatan</Label><Input name="speed" value={formData.speed || ''} onChange={handleChange} required /></div>
                        <div className="space-y-1"><Label>Harga</Label><Input name="price" value={formData.price || ''} onChange={handleChange} required /></div>
                        {type === 'parallelPackages' && <div className="space-y-1"><Label>Syarat</Label><Input name="requirement" value={(formData as ParallelPackage).requirement || ''} onChange={handleChange} required /></div>}
                        <div className="space-y-1"><Label>Fitur (per baris)</Label><Textarea name="features" value={formData.features?.join('\n') || ''} onChange={handleChange} /></div>
                        <div className="space-y-2 p-3 border rounded-md">
                            <Label>URL Gambar</Label><Input name="image.imageUrl" value={formData.image?.imageUrl || ''} onChange={handleChange} />
                            <Label>Deskripsi</Label><Input name="image.description" value={formData.image?.description || ''} onChange={handleChange} />
                            <Label>Hint</Label><Input name="image.imageHint" value={formData.image?.imageHint || ''} onChange={handleChange} />
                        </div>
                        {type === 'offersTV' && <><div className="space-y-1"><Label>Channel</Label><Input name="channels" value={(formData as OfferTV).channels || ''} onChange={handleChange} required /></div><div className="space-y-1"><Label>STB</Label><Input name="stb" value={(formData as OfferTV).stb || ''} onChange={handleChange} required /></div></>}
                        <DialogFooter><Button type="submit" disabled={formLoading}>{formLoading ? <Loader className="animate-spin" /> : 'Simpan'}</Button></DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
