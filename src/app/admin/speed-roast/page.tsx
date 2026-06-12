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
  writeBatch,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader, PlusCircle, Trash2, Edit, Info, Sparkles, Wand2, CheckCircle2, MessageSquareQuote } from 'lucide-react';
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
import { generateBatchRoast } from '@/ai/flows/speed-roast-generator';
import { Card, CardContent } from '@/components/ui/card';

const AI_TOPICS = [
    { label: "Sarkas & Pedas", value: "Sarkasme tajam khas sosmed" },
    { label: "Gamer Banget", value: "Istilah gaming, lag, ping, ping gede" },
    { label: "Anak Gaul Sosmed", value: "Bahasa gaul, FYP, viral, FOMO" },
    { label: "Profesional/WFH", value: "Zoom meeting, upload file, deadline" },
    { label: "Lucu & Jenaka", value: "Komedi ringan dan perumpamaan kocak" }
];

export default function ManageSpeedRoastPage() {
  const [templates, setTemplates] = useState<SpeedRoastTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
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
            Sesuaikan sindiran cerdas AI untuk Speed Challenge MyRepublic secara dinamis.
          </p>
           <Button asChild variant="link" className="p-0 mt-2">
                <Link href="/admin">Kembali ke dasbor</Link>
            </Button>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setIsBatchOpen(true)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Wand2 className="mr-2 h-5 w-5" />
                Batch Generate AI
            </Button>
            <Button onClick={() => { setEditingTemplate(null); setIsFormOpen(true); }} size="default">
                <PlusCircle className="mr-2 h-5 w-5" />
                Tambah Manual
            </Button>
        </div>
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
                                    <Button variant="outline" size="sm" onClick={() => { setEditingTemplate(tpl); setIsFormOpen(true); }}>
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
                                Belum ada template roasting. Gunakan "Batch Generate AI" untuk mengisi cepat.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )}
      </div>
      
      <RoastForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} template={editingTemplate} />
      <BatchRoastDialog isOpen={isBatchOpen} setIsOpen={setIsBatchOpen} />
    </div>
  );
}

function BatchRoastDialog({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
    const [selectedTopic, setSelectedTopic] = useState(AI_TOPICS[0].value);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [batchResults, setBatchResults] = useState<any[] | null>(null);
    
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsGenerating(true);
        setBatchResults(null);
        try {
            const result = await generateBatchRoast({ topic: selectedTopic });
            setBatchResults(result.templates);
            toast({ title: 'AI Selesai!', description: '3 Kategori kalimat telah dihasilkan.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Gagal', description: 'AI gagal menghasilkan kalimat batch.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveAll = async () => {
        if (!firestore || !batchResults) return;
        setIsSaving(true);
        try {
            const batch = writeBatch(firestore);
            batchResults.forEach(item => {
                const docId = `roast-batch-${Date.now()}-${item.category}`;
                const docRef = doc(firestore, 'speedRoastTemplates', docId);
                batch.set(docRef, { ...item, id: docId });
            });
            await batch.commit();
            toast({ title: 'Berhasil!', description: '3 Template baru telah ditambahkan ke database.' });
            setIsOpen(false);
            setBatchResults(null);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menulis ke Firestore.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-6 w-6 text-primary" />
                        Magic Topic Generator (Batch 3-in-1)
                    </DialogTitle>
                    <DialogDescription>
                        Sekali klik untuk menghasilkan template lengkap untuk semua kategori kecepatan (Siput, Kura-kura, Kelinci).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-end bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex-1 space-y-2">
                            <Label>Pilih Topik / Gaya Bahasa</Label>
                            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Pilih topik..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {AI_TOPICS.map(t => <SelectItem key={t.label} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full sm:w-auto">
                            {isGenerating ? <Loader className="animate-spin mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
                            Generate All
                        </Button>
                    </div>

                    {batchResults && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <h3 className="font-bold text-lg border-b pb-2">Hasil Preview:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {batchResults.map((item, idx) => (
                                    <Card key={idx} className="border-primary/20 overflow-hidden">
                                        <div className={`p-2 text-center text-[10px] font-black uppercase text-white ${
                                            item.category === 'siput' ? 'bg-red-500' : item.category === 'kurakura' ? 'bg-yellow-500' : 'bg-green-600'
                                        }`}>
                                            {item.category}
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            <p className="text-xs italic leading-relaxed">"{item.roast}"</p>
                                            <div className="text-[10px] space-y-1">
                                                <div className="bg-muted p-1.5 rounded"><span className="font-bold">Diag:</span> {item.diagnosis}</div>
                                                <div className="bg-primary/5 p-1.5 rounded text-primary"><span className="font-bold">Aksi:</span> {item.action}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button onClick={handleSaveAll} disabled={!batchResults || isSaving} className="bg-green-600 hover:bg-green-700">
                        {isSaving ? <Loader className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Simpan Semua ke Database
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
            setFormData({ category: 'siput', roast: '', diagnosis: '', action: '' });
        }
    }, [isOpen, template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        setFormLoading(true);
        const docId = template?.id || `roast-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'speedRoastTemplates', docId), { ...formData, id: docId });
            toast({ title: 'Sukses!', description: 'Kalimat roasting berhasil disimpan.' });
            setIsOpen(false);
        } catch (e) { 
            toast({ variant: 'destructive', title: 'Gagal', description: 'Error saat menyimpan.' }); 
        } finally { setFormLoading(false); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{template ? 'Edit Kalimat' : 'Tambah Kalimat Manual'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Kategori Kecepatan</Label>
                        <Select value={formData.category} onValueChange={(val: any) => setFormData({...formData, category: val})}>
                            <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="siput">Siput (Lemot)</SelectItem>
                                <SelectItem value="kurakura">Kura-kura (Nanggung)</SelectItem>
                                <SelectItem value="kelinci">Kelinci (Cepat)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Kalimat Sindiran (Roast)</Label>
                        <Textarea value={formData.roast} onChange={(e) => setFormData({...formData, roast: e.target.value})} placeholder="Sebutkan sindiranmu..." className="min-h-[100px]" required />
                        <div className="bg-blue-50 p-2 rounded text-[10px] text-blue-700 flex gap-2 items-start">
                            <Info className="h-3 w-3 shrink-0 mt-0.5" />
                            <p>Placeholder: [CITY], [SPEED], [TAPS], [CONN].</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Diagnosa</Label>
                            <Input value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Rekomendasi</Label>
                            <Input value={formData.action} onChange={(e) => setFormData({...formData, action: e.target.value})} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={formLoading} className="w-full">
                            {formLoading && <Loader className="animate-spin mr-2 h-4 w-4" />} Simpan Template
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
