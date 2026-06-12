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
import { Loader, PlusCircle, Trash2, Edit, Info } from 'lucide-react';
import type { SpeedRoastTemplate } from '@/lib/definitions';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ManageSpeedRoastPage() {
  const [templates, setTemplates] = useState<SpeedRoastTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SpeedRoastTemplate | null>(null);
  
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    setLoading(true);
    const q = query(collection(firestore, 'speedRoastTemplates'), orderBy('category'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpeedRoastTemplate)));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching templates:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  const handleOpenForm = (template: SpeedRoastTemplate | null) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'speedRoastTemplates', id));
      toast({ title: 'Sukses!', description: 'Template berhasil dihapus.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus template.' });
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch(cat) {
        case 'siput': return <Badge variant="destructive" className="uppercase">Siput (&lt;15 Mbps)</Badge>;
        case 'kurakura': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white uppercase">Kura-kura (15-40 Mbps)</Badge>;
        case 'kelinci': return <Badge variant="default" className="bg-green-600 hover:bg-green-700 uppercase">Kelinci (&gt;40 Mbps)</Badge>;
        default: return <Badge>{cat}</Badge>;
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">
            Kelola Kalimat Roasting
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
            Sesuaikan sindiran cerdas AI untuk Speed Challenge MyRepublic.
          </p>
           <Button asChild variant="link" className="p-0 mt-2">
                <Link href="/admin">Kembali ke dasbor</Link>
            </Button>
        </div>
        <Button onClick={() => handleOpenForm(null)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Tambah Kalimat Baru
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-48">Kategori</TableHead>
                        <TableHead>Kalimat Roasting (Sindiran)</TableHead>
                        <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {templates.length > 0 ? templates.map((tpl) => (
                        <TableRow key={tpl.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>{getCategoryBadge(tpl.category)}</TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium line-clamp-2 italic">"{tpl.roast}"</p>
                                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                                        <span className="bg-muted px-1.5 rounded">Diag: {tpl.diagnosis}</span>
                                        <span className="bg-muted px-1.5 rounded text-primary">Aksi: {tpl.action}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                 <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenForm(tpl)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus kalimat ini?</AlertDialogTitle>
                                                <AlertDialogDescription>Tindakan ini permanen dan akan menghapus template roasting dari database.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(tpl.id)}>Hapus Sekarang</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                Belum ada template roasting. Klik "Tambah Kalimat Baru".
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )}
      </div>
      
      <RoastForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} template={editingTemplate} />
    </div>
  );
}

function RoastForm({ isOpen, setIsOpen, template }: { isOpen: boolean; setIsOpen: (o: boolean) => void; template: SpeedRoastTemplate | null; }) {
    const [formData, setFormData] = useState<Partial<SpeedRoastTemplate>>({
        category: 'siput',
        roast: '',
        diagnosis: '',
        action: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => { 
        if (template) {
            setFormData(template);
        } else {
            setFormData({
                category: 'siput',
                roast: '',
                diagnosis: '',
                action: ''
            });
        }
    }, [isOpen, template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        setFormLoading(true);
        
        const docId = template?.id || `roast-${Date.now()}`;
        const finalData = { ...formData, id: docId };

        try {
            await setDoc(doc(firestore, 'speedRoastTemplates', docId), finalData);
            toast({ title: 'Sukses!', description: 'Kalimat roasting berhasil disimpan.' });
            setIsOpen(false);
        } catch (e) { 
            console.error(e);
            toast({ variant: 'destructive', title: 'Gagal', description: 'Error saat menyimpan ke Firestore.' }); 
        } finally { 
            setFormLoading(false); 
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{template ? 'Edit Kalimat Roasting' : 'Tambah Kalimat Roasting'}</DialogTitle>
                    <DialogDescription>Gunakan bahasa gaul Indonesia yang asik dan menyinggung koneksi lemot.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Kategori Kecepatan</Label>
                        <Select 
                            value={formData.category} 
                            onValueChange={(val: any) => setFormData({...formData, category: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="siput">Siput (Lemot Banget)</SelectItem>
                                <SelectItem value="kurakura">Kura-kura (Nanggung)</SelectItem>
                                <SelectItem value="kelinci">Kelinci (Cepat tapi Butuh MyRep)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Kalimat Sindiran (Roast)</Label>
                        <Textarea 
                            value={formData.roast} 
                            onChange={(e) => setFormData({...formData, roast: e.target.value})} 
                            placeholder="Sebutkan sindiranmu di sini..."
                            className="min-h-[100px]"
                            required
                        />
                        <div className="bg-blue-50 p-2 rounded text-[10px] text-blue-700 flex gap-2 items-start">
                            <Info className="h-3 w-3 shrink-0 mt-0.5" />
                            <p>
                                <strong>Gunakan Placeholder:</strong><br />
                                <code>[CITY]</code> = Nama Kota, <code>[SPEED]</code> = Mbps, <code>[TAPS]</code> = Jumlah Klik, <code>[CONN]</code> = Jenis Koneksi.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Diagnosa Singkat</Label>
                            <Input 
                                value={formData.diagnosis} 
                                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
                                placeholder="cth: Jaringan anemia"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Rekomendasi Aksi</Label>
                            <Input 
                                value={formData.action} 
                                onChange={(e) => setFormData({...formData, action: e.target.value})} 
                                placeholder="cth: Segera ganti ke MyRep"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={formLoading} className="w-full">
                            {formLoading ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
