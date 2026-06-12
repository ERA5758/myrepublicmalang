'use server';

/**
 * @fileOverview Alur Genkit untuk menghasilkan 3 kategori template roasting sekaligus.
 *
 * Menerima satu topik dan menghasilkan 3 kalimat sindiran (siput, kurakura, kelinci)
 * beserta diagnosa dan aksi rekomendasinya dalam satu kali proses AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeedRoastBatchInputSchema = z.object({
  topic: z.string().describe('Topik atau gaya bahasa (contoh: Sarkas, Gaul, Gamer, Profesional).'),
});

export type SpeedRoastBatchInput = z.infer<typeof SpeedRoastBatchInputSchema>;

const SingleRoastSchema = z.object({
    category: z.enum(['siput', 'kurakura', 'kelinci']),
    roast: z.string().describe('Kalimat sindiran kreatif menggunakan placeholder [CITY], [SPEED], [TAPS], dan [CONN].'),
    diagnosis: z.string().describe('Diagnosa singkat pseudo-teknis yang lucu.'),
    action: z.string().describe('Rekomendasi aksi singkat untuk pindah ke MyRepublic.'),
});

const SpeedRoastBatchOutputSchema = z.object({
  templates: z.array(SingleRoastSchema).length(3).describe('Daftar 3 template untuk masing-masing kategori.'),
});

export type SpeedRoastBatchOutput = z.infer<typeof SpeedRoastBatchOutputSchema>;

export async function generateBatchRoast(input: SpeedRoastBatchInput): Promise<SpeedRoastBatchOutput> {
  return speedRoastBatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'speedRoastBatchPrompt',
  input: { schema: SpeedRoastBatchInputSchema },
  output: { schema: SpeedRoastBatchOutputSchema },
  prompt: `Anda adalah copywriter kreatif profesional dari MyRepublic Indonesia yang ahli dalam membuat sindiran (roasting) yang sangat cerdas dan lucu.

Tugas Anda adalah menghasilkan TIGA (3) template roasting sekaligus untuk satu gaya bahasa/topik: "{{{topic}}}".

SETIAP TEMPLATE HARUS UNTUK KATEGORI BERBEDA:
1. 'siput': Internet sangat lambat (<15 Mbps), menyebalkan, ketinggalan jaman.
2. 'kurakura': Internet nanggung (15-40 Mbps), asimetris (upload pelit), bikin emosi buat upload/game.
3. 'kelinci': Internet sudah lumayan cepat (>40 Mbps) tapi biasanya ada FUP (kuota) atau tidak stabil dibandingkan MyRepublic yang Simetris 1:1.

INSTRUKSI WAJIB:
- Gunakan bahasa Indonesia yang luwes, jenaka, dan relevan dengan budaya internet saat ini.
- Gunakan placeholder berikut di SETIAP kalimat roasting:
   - [CITY] untuk nama kota.
   - [SPEED] untuk angka kecepatan (Mbps).
   - [TAPS] untuk jumlah ketukan roket.
   - [CONN] untuk jenis koneksi yang digunakan.
- Diagnosa dan aksi harus singkat, lucu, namun tetap menonjolkan keunggulan MyRepublic (Simetris 1:1, Tanpa FUP, Full Fiber).

Pastikan output dalam format JSON yang valid sesuai skema.`,
});

const speedRoastBatchFlow = ai.defineFlow(
  {
    name: 'speedRoastBatchFlow',
    inputSchema: SpeedRoastBatchInputSchema,
    outputSchema: SpeedRoastBatchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI gagal menghasilkan konten batch.');
    return output;
  }
);
