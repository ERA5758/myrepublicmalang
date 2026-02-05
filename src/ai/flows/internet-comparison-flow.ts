'use server';

/**
 * @fileOverview This file defines the Genkit flow for internet plan comparison.
 *
 * It takes a user's current internet provider, price, and their description
 * of speed test results, and returns an AI-generated comparison highlighting
 * the benefits of switching to MyRepublic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InternetComparisonInputSchema = z.object({
  currentProvider: z.string().describe('Nama provider internet yang digunakan pengguna saat ini (misal: IndiHome, Biznet).'),
  currentPrice: z.string().describe('Biaya bulanan yang dibayar pengguna saat ini (misal: Rp 350.000).'),
  speedTestResult: z.string().describe('Hasil tes kecepatan yang didapat pengguna, biasanya mencakup kecepatan unduh, unggah, dan latensi (ping). Misal: "Download 25 Mbps, Upload 5 Mbps, Ping 20ms".'),
});
export type InternetComparisonInput = z.infer<typeof InternetComparisonInputSchema>;

const InternetComparisonOutputSchema = z.object({
  comparisonTitle: z.string().describe('Judul yang menarik untuk hasil perbandingan, contoh: "Analisis: MyRepublic vs. Provider Anda".'),
  analysis: z.string().describe('Analisis mendalam dalam format HTML yang membandingkan layanan pengguna saat ini dengan MyRepublic. Jelaskan konsep kecepatan simetris, latensi, dan bagaimana MyRepublic unggul. Gunakan tag <p>, <strong>, dan <ul><li>. Buat dalam beberapa paragraf.'),
  recommendedPlan: z.object({
    name: z.string().describe('Nama paket MyRepublic yang paling sesuai sebagai alternatif, contoh: "Value 30 Mbps".'),
    reason: z.string().describe('Alasan singkat mengapa paket ini direkomendasikan berdasarkan data pengguna.'),
  }),
});
export type InternetComparisonOutput = z.infer<typeof InternetComparisonOutputSchema>;


export async function compareInternet(input: InternetComparisonInput): Promise<InternetComparisonOutput> {
    return internetComparisonFlow(input);
}


const prompt = ai.definePrompt({
  name: 'internetComparisonPrompt',
  input: { schema: InternetComparisonInputSchema },
  output: { schema: InternetComparisonOutputSchema },
  prompt: `Anda adalah seorang analis teknis dan sales expert untuk MyRepublic.
Tugas Anda adalah menganalisis data provider internet pengguna saat ini dan membandingkannya dengan keunggulan MyRepublic untuk meyakinkan mereka beralih.

Data Pengguna Saat Ini:
- Provider: {{{currentProvider}}}
- Harga Bulanan: {{{currentPrice}}}
- Hasil Speed Test: {{{speedTestResult}}}

Paket MyRepublic Tersedia (sebagai referensi):
- Value 30 Mbps: Rp 227.550/bln (Simetris 30/30 Mbps)
- Fast 100 Mbps: Rp 260.850/bln (Simetris 100/100 Mbps)
- Nova 100 Mbps: Rp 333.000/bln (Simetris 100/100 Mbps)
- MyGamer 250 Mbps: Rp 444.000/bln (Simetris 250/250 Mbps, latensi rendah)


Instruksi Analisis (WAJIB DIIKUTI):
1.  **Judul:** Buat judul perbandingan yang kuat.
2.  **Analisis (HTML):**
    -   Mulai dengan paragraf pembuka yang mengakui hasil speed test pengguna.
    -   Fokus utama pada perbedaan kecepatan **Upload** dan **Download**. Jelaskan apa itu kecepatan simetris (1:1) yang dimiliki MyRepublic dan mengapa itu krusial untuk aktivitas seperti video call, upload file besar, dan gaming. Bandingkan dengan kecepatan asimetris yang kemungkinan besar dimiliki pengguna saat ini.
    -   Bahas **Latensi (Ping)**. Jika ping pengguna cukup tinggi, jelaskan bagaimana latensi rendah MyRepublic (terutama paket MyGamer) memberikan pengalaman online yang lebih responsif.
    -   Bandingkan **Harga**. Tunjukkan bagaimana MyRepublic bisa memberikan kecepatan yang lebih tinggi (terutama kecepatan upload) dengan harga yang mungkin lebih terjangkau atau setara.
    -   Sebutkan keunggulan lain: 100% fiber optic (tahan cuaca), dan tanpa FUP (kuota unlimited).
    -   Gunakan format HTML: paragraf (<p>), bold (<strong>), dan daftar (<ul><li>). Buat setidaknya 3 paragraf.
3.  **Rekomendasi Paket:**
    -   Pilih SATU paket MyRepublic yang paling relevan dan menguntungkan bagi pengguna berdasarkan harga dan hasil speed test mereka.
    -   Berikan alasan singkat mengapa paket itu adalah pilihan yang lebih baik.

Pastikan output Anda dalam format JSON yang valid.`,
});


const internetComparisonFlow = ai.defineFlow(
  {
    name: 'internetComparisonFlow',
    inputSchema: InternetComparisonInputSchema,
    outputSchema: InternetComparisonOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Gagal menghasilkan perbandingan.');
    }
    return output;
  }
);
