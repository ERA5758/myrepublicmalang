'use server';

/**
 * @fileOverview Alur Genkit untuk menghasilkan template roasting internet secara otomatis.
 *
 * Menggunakan AI untuk membuat kalimat sindiran (roast), diagnosa, dan rekomendasi
 * yang kreatif berdasarkan kategori kecepatan dan topik yang dipilih.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeedRoastGeneratorInputSchema = z.object({
  category: z.enum(['siput', 'kurakura', 'kelinci']).describe('Kategori kecepatan internet.'),
  topic: z.string().describe('Topik atau gaya bahasa (contoh: Sarkas, Gaul, Gamer, Motivasi).'),
});

export type SpeedRoastGeneratorInput = z.infer<typeof SpeedRoastGeneratorInputSchema>;

const SpeedRoastGeneratorOutputSchema = z.object({
  roast: z.string().describe('Kalimat sindiran (roast) yang kreatif menggunakan placeholder [CITY], [SPEED], [TAPS], dan [CONN].'),
  diagnosis: z.string().describe('Diagnosa singkat pseudo-teknis yang lucu.'),
  action: z.string().describe('Rekomendasi aksi singkat untuk pindah ke MyRepublic.'),
});

export type SpeedRoastGeneratorOutput = z.infer<typeof SpeedRoastGeneratorOutputSchema>;

export async function generateRoastContent(input: SpeedRoastGeneratorInput): Promise<SpeedRoastGeneratorOutput> {
  return speedRoastGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'speedRoastGeneratorPrompt',
  input: { schema: SpeedRoastGeneratorInputSchema },
  output: { schema: SpeedRoastGeneratorOutputSchema },
  prompt: `Anda adalah copywriter kreatif profesional dari MyRepublic Indonesia yang ahli dalam membuat sindiran (roasting) yang cerdas, lucu, dan sangat relevan dengan budaya internet di Indonesia.

Tugas Anda adalah menghasilkan SATU template roasting untuk kategori: {{{category}}} dengan gaya bahasa/topik: {{{topic}}}.

INSTRUKSI PENTING:
1. **Placeholder (WAJIB):** Anda HARUS menyertakan placeholder berikut di dalam kalimat roasting:
   - [CITY] untuk nama kota.
   - [SPEED] untuk angka kecepatan (Mbps).
   - [TAPS] untuk jumlah ketukan roket.
   - [CONN] untuk jenis koneksi yang digunakan.
2. **Kategori Context:**
   - 'siput': Internet sangat lambat, bikin emosi, ketinggalan jaman.
   - 'kurakura': Internet nanggung, asimetris (upload pelit), oke buat chat tapi payah buat kerja/game.
   - 'kelinci': Internet sudah lumayan cepat tapi biasanya ada batasan FUP (kuota) atau tidak stabil.
3. **Gaya Bahasa:** Sesuaikan dengan topik '{{{topic}}}'. Jika 'Sarkas', buat yang agak pedas. Jika 'Gamer', gunakan istilah dunia game (lag, ping, AFK, noob). Jika 'Gaul', gunakan bahasa anak muda Jakarta/sosmed saat ini.
4. **Output:** Berikan diagnosa lucu dan rekomendasi aksi singkat yang menjual keunggulan MyRepublic (Simetris 1:1, Tanpa FUP, Full Fiber).

Pastikan output dalam JSON yang valid.`,
});

const speedRoastGeneratorFlow = ai.defineFlow(
  {
    name: 'speedRoastGeneratorFlow',
    inputSchema: SpeedRoastGeneratorInputSchema,
    outputSchema: SpeedRoastGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI gagal menghasilkan konten.');
    return output;
  }
);
