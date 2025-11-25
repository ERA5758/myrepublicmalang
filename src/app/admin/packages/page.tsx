
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
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
import type { Offer, OfferTV, ImagePlaceholder } from '@/lib/definitions';
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


type PackageType = 'offers' | 'offersTV';
type PackageData = Offer | OfferTV;

export default function ManagePackagesPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersTV, setOffersTV] = useState<OfferTV[]>([]);
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

    const unsubscribeOffers = onSnapshot(offersQuery, (snapshot) => {
      const fetchedOffers = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Offer
      );
      setOffers(fetchedOffers);
      setLoading(false);
    });

    const unsubscribeOffersTV = onSnapshot(offersTVQuery, (snapshot) => {
      const fetchedOffersTV = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as OfferTV
      );
      setOffersTV(fetchedOffersTV);
      setLoading(false);
    });

    return () => {
      unsubscribeOffers();
      unsubscribeOffersTV();
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
      toast({
        title: 'Sukses!',
        description: 'Paket berhasil dihapus.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus',
        description: 'Terjadi kesalahan saat menghapus paket.',
      });
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
            Tambah, edit, dan hapus paket internet dan TV.
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="offers">Internet Saja</TabsTrigger>
          <TabsTrigger value="offersTV">Internet + TV</TabsTrigger>
        </TabsList>
        <TabsContent value="offers">
          <PackageTable
            packages={offers}
            type="offers"
            onEdit={(pkg) => handleOpenForm(pkg, 'offers')}
            onDelete={(id) => handleDelete(id, 'offers')}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="offersTV">
          <PackageTable
            packages={offersTV}
            type="offersTV"
            onEdit={(pkg) => handleOpenForm(pkg, 'offersTV')}
            onDelete={(id) => handleDelete(id, 'offersTV')}
            loading={loading}
            isTVPackage
          />
        </TabsContent>
      </Tabs>
      
      <PackageForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        pkg={editingPackage}
        type={activeTab}
      />
    </div>
  );
}

// @ts-ignore
function PackageTable({ packages, type, onEdit, onDelete, loading, isTVPackage = false }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Paket</TableHead>
                    <TableHead>Kecepatan</TableHead>
                    <TableHead>Harga</TableHead>
                    {isTVPackage && <TableHead>Channel</TableHead>}
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.title}</TableCell>
                        <TableCell>{pkg.speed}</TableCell>
                        <TableCell>{pkg.price}</TableCell>
                        {isTVPackage && <TableCell>{(pkg as OfferTV).channels}</TableCell>}
                        <TableCell className="text-right">
                             <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(pkg)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus paket secara permanen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(pkg.id)}>Hapus</AlertDialogAction>
                                        </AlertDialogFooter>
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

function PackageForm({ isOpen, setIsOpen, pkg, type }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    pkg: PackageData | null;
    type: PackageType;
}) {
    const defaultImage: ImagePlaceholder = { id: '', imageUrl: '', imageHint: '', description: '' };
    const [formData, setFormData] = useState<Partial<PackageData>>({ image: defaultImage });
    const [formLoading, setFormLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setFormData(pkg ? { ...pkg } : { id: '', title: '', speed: '', price: '', features: [], promo: '', image: { ...defaultImage } });
        }
    }, [isOpen, pkg]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('image.')) {
            const imageField = name.split('.')[1];
            setFormData(prev => ({ 
                ...prev, 
                image: { 
                    ...(prev?.image || defaultImage), 
                    [imageField]: value 
                }
            }));
        } else if (name === 'features') {
            setFormData({ ...formData, [name]: value.split('\n') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        setFormLoading(true);

        const dataToSave = { ...formData };
        if (!dataToSave.id) {
          dataToSave.id = dataToSave.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (dataToSave.image && !dataToSave.image.id) {
            dataToSave.image.id = dataToSave.id!;
        }

        try {
            if (pkg) { // Editing existing package
                const docRef = doc(firestore, type, pkg.id);
                await updateDoc(docRef, dataToSave);
                 toast({ title: 'Sukses!', description: 'Paket berhasil diperbarui.' });
            } else { // Adding new package
                if (!dataToSave.id) throw new Error("ID paket tidak boleh kosong.");
                const docRef = doc(firestore, type, dataToSave.id);
                await setDoc(docRef, dataToSave);
                toast({ title: 'Sukses!', description: 'Paket baru berhasil ditambahkan.' });
            }
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan paket.' });
        } finally {
            setFormLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{pkg ? 'Edit Paket' : 'Tambah Paket Baru'}</DialogTitle>
                    <DialogDescription>
                        Isi detail paket di bawah ini. Klik simpan jika sudah selesai.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-6">
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        {!pkg && (
                            <div className="space-y-2">
                                <Label htmlFor="id">ID Paket</Label>
                                <Input id="id" name="id" value={formData.id || ''} onChange={handleChange} required placeholder="cth: value-30mbps" />
                                <p className="text-xs text-muted-foreground">Gunakan huruf kecil, angka, dan tanda hubung. Cth: `value-30mbps`</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="title">Nama Paket</Label>
                            <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="speed">Kecepatan</Label>
                            <Input id="speed" name="speed" value={formData.speed || ''} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga</Label>
                            <Input id="price" name="price" value={formData.price || ''} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="promo">Promo</Label>
                            <Input id="promo" name="promo" value={formData.promo || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="features">Fitur (satu per baris)</Label>
                            <Textarea id="features" name="features" value={formData.features?.join('\n') || ''} onChange={handleChange} />
                        </div>

                         <div className="space-y-4 rounded-lg border p-4">
                            <h4 className="font-medium">Data Gambar</h4>
                             <div className="space-y-2">
                                <Label htmlFor="image.imageUrl">URL Gambar</Label>
                                <Input id="image.imageUrl" name="image.imageUrl" value={formData.image?.imageUrl || ''} onChange={handleChange} placeholder="https://picsum.photos/seed/..."/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="image.description">Deskripsi Gambar (Alt Text)</Label>
                                <Input id="image.description" name="image.description" value={formData.image?.description || ''} onChange={handleChange} placeholder="Deskripsi singkat untuk gambar"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="image.imageHint">Petunjuk Gambar</Label>
                                <Input id="image.imageHint" name="image.imageHint" value={formData.image?.imageHint || ''} onChange={handleChange} placeholder="cth: 'internet promo'"/>
                            </div>
                        </div>

                        {type === 'offersTV' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="channels">Jumlah Channel</Label>
                                    <Input id="channels" name="channels" value={(formData as OfferTV).channels || ''} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stb">Tipe STB</Label>
                                    <Input id="stb" name="stb" value={(formData as OfferTV).stb || ''} onChange={handleChange} required />
                                </div>
                            </>
                        )}
                        <DialogFooter className='pt-4 pr-6'>
                            <Button type="submit" disabled={formLoading}>
                                {formLoading ? <Loader className="animate-spin" /> : 'Simpan Paket'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
