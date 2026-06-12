'use server';

/**
 * @fileOverview Genkit flow for generating sarcastic internet speed roasts.
 *
 * This flow takes the user's current internet speed, city, and game performance
 * to generate a witty, sarcastic, and funny roast in Indonesian.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeedRoastInputSchema = z.object({
  speed: z.number().describe('The user\'s current internet speed in Mbps.'),
  taps: z.number().describe('Number of taps achieved in the 5-second challenge.'),
  city: z.string().describe('The user\'s city.'),
  connectionType: z.string().describe('Type of connection used (e.g., WiFi Rumah, Mobile Data).'),
});
export type SpeedRoastInput = z.infer<typeof SpeedRoastInputSchema>;

const SpeedRoastOutputSchema = z.object({
  roast: z.string().describe('A witty and sarcastic roast in Indonesian.'),
  diagnosis: z.string().describe('A short pseudo-technical diagnosis.'),
  recommendedAction: z.string().describe('A friendly recommendation to switch to MyRepublic.'),
});
export type SpeedRoastOutput = z.infer<typeof SpeedRoastOutputSchema>;

export async function generateSpeedRoast(input: SpeedRoastInput): Promise<SpeedRoastOutput> {
  return speedRoastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'speedRoastPrompt',
  input: { schema: SpeedRoastInputSchema },
  output: { schema: SpeedRoastOutputSchema },
  prompt: `Anda adalah asisten AI dari MyRepublic Indonesia yang jenaka, sarkastik, cerdas, dan ahli jaringan internet.
Tugas Anda adalah memberikan sindiran ('roast') khas Indonesia yang lucu tentang internet lambat milik user, lalu memberikan diagnosa dan rekomendasi kenapa mereka harus pindah ke MyRepublic.

Data User:
- Kecepatan: {{{speed}}} Mbps
- Jumlah Tap: {{{taps}}} kali dalam 5 detik
- Kota: {{{city}}}
- Jenis Koneksi: {{{connectionType}}}

Instruksi:
1. **Roast:** Buat sindiran cerdas, kocak, dan sarkastik khas Indonesia. Sebutkan jumlah tap user yang mungkin sia-sia karena koneksi yang lemot. Gunakan bahasa gaul yang sopan namun "pedas".
2. **Diagnosis:** Berikan alasan teknis (atau pseudo-teknis yang lucu) kenapa koneksi mereka seperti itu.
3. **Rekomendasi:** Berikan ajakan ramah untuk beralih ke MyRepublic yang memiliki koneksi simetris 1:1 dan tanpa FUP.

Pastikan output dalam format JSON yang valid.`,
});

const speedRoastFlow = ai.defineFlow(
  {
    name: 'speedRoastFlow',
    inputSchema: SpeedRoastInputSchema,
    outputSchema: SpeedRoastOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('Gagal menghasilkan roast.');
    return output;
  }
);
