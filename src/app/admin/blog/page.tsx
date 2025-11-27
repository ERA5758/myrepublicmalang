'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader, Sparkles, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { generateBlogPost } from '@/ai/flows/blog-post-generator';
import type { BlogPostGeneratorOutput } from '@/ai/flows/blog-post-generator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogTopics } from '@/lib/blog-data';

function GenerateButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" disabled={disabled} className="w-full">
      {disabled ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Hasilkan Artikel
    </Button>
  );
}

type GroupedTopics = {
    [category: string]: string[];
};

export default function BlogCreatorPage() {
  const [generatedArticle, setGeneratedArticle] = useState<BlogPostGeneratorOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<GroupedTopics>({});
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function getAvailableTopics() {
      if (!firestore) return;
      setIsLoadingTopics(true);
      try {
        const articlesCollection = collection(firestore, 'articles');
        const querySnapshot = await getDocs(articlesCollection);
        const existingSlugs = querySnapshot.docs.map(doc => doc.data().slug as string);
        
        const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const unseenTopics: GroupedTopics = {};
        for (const category in blogTopics) {
            const topicsInCategory = blogTopics[category as keyof typeof blogTopics];
            const filteredTopics = topicsInCategory.filter(topic => !existingSlugs.includes(slugify(topic)));
            if (filteredTopics.length > 0) {
                unseenTopics[category] = filteredTopics;
            }
        }

        setAvailableTopics(unseenTopics);
      } catch (error) {
        console.error("Gagal mengambil topik:", error);
        toast({ title: 'Gagal memuat topik', description: 'Tidak dapat mengambil data artikel dari Firestore.', variant: 'destructive' });
      } finally {
        setIsLoadingTopics(false);
      }
    }
    getAvailableTopics();
  }, [firestore, toast]);


  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopic) {
        toast({ title: 'Topik belum dipilih', description: 'Silakan pilih topik dari daftar.', variant: 'destructive' });
        return;
    }
    
    setIsGenerating(true);
    setGeneratedArticle(null);

    try {
        const article = await generateBlogPost({ topic: selectedTopic });
        setGeneratedArticle(article);
        toast({ title: 'Sukses!', description: 'Artikel berhasil dibuat oleh AI.' });
    } catch (error) {
        console.error(error);
        toast({ title: 'Gagal Membuat Artikel', description: 'Terjadi kesalahan saat berkomunikasi dengan AI.', variant: 'destructive' });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleSave = async () => {
    if (!generatedArticle || !firestore) return;

    setIsSaving(true);
    try {
        const articlesCollection = collection(firestore, 'articles');
        await addDoc(articlesCollection, {
            ...generatedArticle,
            publishedAt: serverTimestamp(),
        });
        toast({
            title: 'Artikel Tersimpan!',
            description: `"${generatedArticle.title}" telah ditambahkan ke Firestore.`,
        });
        
        // Remove the published topic from the available list
         const updatedTopics = { ...availableTopics };
        for (const category in updatedTopics) {
            updatedTopics[category] = updatedTopics[category].filter(t => t !== selectedTopic);
            if (updatedTopics[category].length === 0) {
                delete updatedTopics[category];
            }
        }
        setAvailableTopics(updatedTopics);
        
        setSelectedTopic('');
        setGeneratedArticle(null); // Clear after saving

    } catch (error) {
        console.error("Error saving article:", error);
        toast({
            title: 'Gagal Menyimpan',
            description: 'Terjadi kesalahan saat menyimpan artikel ke Firestore.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  }

  const hasAvailableTopics = Object.keys(availableTopics).length > 0;

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Pembuat Konten Blog AI
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Pilih topik dari daftar, dan biarkan AI menulis draf pertama artikel blog Anda.
        </p>
        <Button asChild variant="link" className="p-0 mt-2">
          <Link href="/admin">Kembali ke dasbor</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generator Artikel</CardTitle>
            <CardDescription>Pilih salah satu topik yang belum pernah dibuat sebelumnya.</CardDescription>
          </CardHeader>
          <form onSubmit={handleGenerate}>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="topic">Pilih Topik Blog</Label>
                {isLoadingTopics ? (
                    <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin"/>
                        <span>Memuat topik...</span>
                    </div>
                ) : (
                    <Select name="topic" required value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger id="topic">
                            <SelectValue placeholder="Pilih topik yang tersedia..." />
                        </SelectTrigger>
                        <SelectContent>
                             {hasAvailableTopics ? (
                                Object.entries(availableTopics).map(([category, topics]) => (
                                    <SelectGroup key={category}>
                                        <SelectLabel>{category}</SelectLabel>
                                        {topics.map(topic => (
                                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))
                            ) : <SelectItem value="no-topics" disabled>Semua topik telah dibuat!</SelectItem>}
                        </SelectContent>
                    </Select>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <GenerateButton disabled={isGenerating || isLoadingTopics || !selectedTopic} />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Hasil Generasi</CardTitle>
            <CardDescription>Artikel yang dihasilkan akan muncul di sini.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center text-muted-foreground">
                <Loader className="mx-auto h-12 w-12 animate-spin" />
                <p className="mt-4">AI sedang menulis, harap tunggu...</p>
              </div>
            ) : generatedArticle ? (
              <div className="w-full space-y-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg border">
                      <Image src={generatedArticle.image.imageUrl} alt={generatedArticle.image.description} fill className="object-cover" />
                  </div>
                  <h2 className="font-headline text-2xl font-bold">{generatedArticle.title}</h2>
                  <p className="text-sm text-muted-foreground italic">{generatedArticle.summary}</p>
                   <div 
                        className="prose prose-sm max-w-none text-foreground text-sm max-h-48 overflow-y-auto border p-2 rounded-md"
                        dangerouslySetInnerHTML={{ __html: generatedArticle.content }}
                    />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-4">Menunggu untuk menghasilkan artikel.</p>
              </div>
            )}
          </CardContent>
           {generatedArticle && (
             <CardFooter className='flex-col gap-2'>
                <p className="text-xs text-center text-muted-foreground">Pastikan untuk meninjau dan mengedit konten sebelum menyimpan.</p>
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Simpan Artikel ke Firestore
                </Button>
            </CardFooter>
           )}
        </Card>
      </div>
    </div>
  );
}
