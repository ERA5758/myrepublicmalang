'use server';

/**
 * @fileOverview Alur Genkit untuk menghasilkan artikel blog lengkap.
 *
 * Alur ini menerima sebuah topik dan menghasilkan judul, ringkasan, konten HTML,
 * slug, kategori, dan detail gambar yang relevan untuk artikel tersebut.
 *
 * @exports generateBlogPost - Fungsi untuk memicu alur pembuatan blog.
 * @exports BlogPostGeneratorInput - Tipe input untuk fungsi generateBlogPost.
 * @exports BlogPostGeneratorOutput - Tipe return untuk fungsi generateBlogPost.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BlogPostGeneratorInputSchema = z.object({
  topic: z.string().describe('Topik utama untuk artikel blog.'),
});
export type BlogPostGeneratorInput = z.infer<typeof BlogPostGeneratorInputSchema>;

const BlogPostGeneratorOutputSchema = z.object({
  title: z.string().describe('Judul artikel blog yang menarik dan SEO-friendly.'),
  summary: z.string().describe('Ringkasan singkat artikel (sekitar 1-2 kalimat).'),
  content: z.string().describe('Konten artikel lengkap dalam format HTML. Gunakan tag <p>, <h3>, dan <ul>.'),
  slug: z.string().describe('Versi URL-friendly dari judul (contoh: judul-artikel-ini).'),
  category: z.string().describe('Satu kategori yang paling relevan untuk artikel ini (misal: Teknologi, Gaming, Hiburan, Berita).'),
  image: z.object({
      imageUrl: z.string().url().describe("URL gambar placeholder dari picsum.photos dengan format https://picsum.photos/seed/{seed}/{width}/{height}. Gunakan seed acak."),
      imageHint: z.string().describe("Dua kata kunci untuk pencarian gambar terkait topik, contoh: 'internet speed'."),
      description: z.string().describe("Deskripsi singkat gambar untuk atribut alt.")
  }).describe("Gambar yang relevan untuk artikel."),
});
export type BlogPostGeneratorOutput = z.infer<typeof BlogPostGeneratorOutputSchema>;

export async function generateBlogPost(input: BlogPostGeneratorInput): Promise<BlogPostGeneratorOutput> {
  return blogPostGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogPostGeneratorPrompt',
  input: { schema: BlogPostGeneratorInputSchema },
  output: { schema: BlogPostGeneratorOutputSchema },
  prompt: `Anda adalah seorang penulis konten profesional yang ahli dalam SEO untuk sebuah penyedia layanan internet bernama MyRepublic.
Tugas Anda adalah menulis artikel blog yang informatif dan menarik berdasarkan topik yang diberikan.

Topik: {{{topic}}}

Instruksi:
1.  **Judul:** Buat judul yang menarik, jelas, dan mengandung kata kunci yang relevan dengan topik.
2.  **Slug:** Buat slug URL dari judul yang Anda buat. Formatnya harus berupa huruf kecil dengan kata-kata yang dipisahkan oleh tanda hubung (-).
3.  **Ringkasan:** Tulis ringkasan singkat (1-2 kalimat) yang merangkum isi artikel.
4.  **Kategori:** Pilih satu kategori yang paling sesuai dari daftar berikut: Teknologi, Gaming, Hiburan, Berita, Layanan.
5.  **Konten (PENTING):** Tulis konten artikel yang informatif, terstruktur dengan baik, dan mudah dibaca, minimal 300 kata.
    - **Gunakan format HTML secara ketat.**
    - **Setiap paragraf WAJIB dibungkus dengan tag <p>...</p>.** Jangan membuat satu blok teks yang panjang. Buat beberapa paragraf.
    - Gunakan tag **<h3>...</h3>** untuk membuat sub-judul yang relevan untuk memecah konten.
    - Jika ada daftar, gunakan tag **<ul>** dengan **<li>**.
    - Jika relevan, sertakan tautan seperti <a href="/register">Daftar Sekarang</a> atau <a href="/cek-area">Area Jangkauan</a>.
6.  **Gambar:** Buat satu objek gambar yang relevan. Gunakan URL dari https://picsum.photos/seed/{seed}/800/600, ganti {seed} dengan kata acak. Berikan deskripsi gambar dan petunjuk pencarian (image hint) yang sesuai.

Pastikan output Anda dalam format JSON yang valid sesuai dengan skema yang diminta.`,
});

const blogPostGeneratorFlow = ai.defineFlow(
  {
    name: 'blogPostGeneratorFlow',
    inputSchema: BlogPostGeneratorInputSchema,
    outputSchema: BlogPostGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Gagal menghasilkan konten blog.');
    }
    return output;
  }
);
