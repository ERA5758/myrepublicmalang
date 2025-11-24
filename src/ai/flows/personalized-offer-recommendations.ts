'use server';

/**
 * @fileOverview File ini berisi alur Genkit untuk memberikan rekomendasi paket MyRepublic yang dipersonalisasi.
 *
 * Alur ini mempertimbangkan alamat pengguna dan kebiasaan penggunaan internet untuk menyarankan paket yang paling sesuai.
 *
 * @exports personalizedOfferRecommendations - Fungsi untuk memicu alur.
 * @exports PersonalizedOfferRecommendationsInput - Tipe input untuk fungsi personalizedOfferRecommendations.
 * @exports PersonalizedOfferRecommendationsOutput - Tipe return untuk fungsi personalizedOfferRecommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedOfferRecommendationsInputSchema = z.object({
  address: z.string().describe('Alamat pengguna di Malang.'),
  internetUsageHabits: z
    .string()
    .describe(
      'Deskripsi kebiasaan penggunaan internet khas pengguna (mis., streaming, bermain game, browsing).'
    ),
});
export type PersonalizedOfferRecommendationsInput = z.infer<typeof PersonalizedOfferRecommendationsInputSchema>;

const PersonalizedOfferRecommendationsOutputSchema = z.object({
  recommendedPlanName: z.string().describe('Nama paket MyRepublic yang direkomendasikan.'),
  recommendedPlanDescription: z.string().describe('Deskripsi paket yang direkomendasikan dan mengapa cocok untuk pengguna.'),
});
export type PersonalizedOfferRecommendationsOutput = z.infer<typeof PersonalizedOfferRecommendationsOutputSchema>;

export async function personalizedOfferRecommendations(input: PersonalizedOfferRecommendationsInput): Promise<PersonalizedOfferRecommendationsOutput> {
  return personalizedOfferRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedOfferRecommendationsPrompt',
  input: {schema: PersonalizedOfferRecommendationsInputSchema},
  output: {schema: PersonalizedOfferRecommendationsOutputSchema},
  prompt: `Anda adalah asisten AI yang berspesialisasi dalam merekomendasikan paket internet MyRepublic kepada pengguna di Malang.

  Berdasarkan alamat pengguna dan kebiasaan penggunaan internet, rekomendasikan paket MyRepublic yang paling sesuai.

  Alamat: {{{address}}}
  Kebiasaan Penggunaan Internet: {{{internetUsageHabits}}}

  Pertimbangkan faktor-faktor berikut saat membuat rekomendasi Anda:
  - Paket MyRepublic yang tersedia di Malang
  - Kebiasaan penggunaan internet pengguna (mis., streaming, bermain game, browsing)
  - Anggaran pengguna

  Berikan nama paket yang direkomendasikan dan deskripsi singkat mengapa paket tersebut cocok untuk pengguna.

  Pastikan output dalam format JSON yang benar.`,
});

const personalizedOfferRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedOfferRecommendationsFlow',
    inputSchema: PersonalizedOfferRecommendationsInputSchema,
    outputSchema: PersonalizedOfferRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
