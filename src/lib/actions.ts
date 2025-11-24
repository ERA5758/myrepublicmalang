'use server';

import { z } from 'zod';
import { personalizedOfferRecommendations } from '@/ai/flows/personalized-offer-recommendations';
import { LeadCaptureSchema, PersonalizedOfferSchema, type LeadCaptureFormState, type PersonalizedOfferFormState } from './definitions';

export async function captureLead(
  prevState: LeadCaptureFormState,
  formData: FormData
): Promise<LeadCaptureFormState> {
  const validatedFields = LeadCaptureSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Data formulir tidak valid. Silakan periksa masukan Anda.',
      issues: validatedFields.error.flatten().fieldErrors ? undefined : validatedFields.error.flatten().formErrors,
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Di sini Anda biasanya akan menyimpan data prospek ke database seperti Firestore.
    // Untuk contoh ini, kita hanya akan mencatatnya ke konsol.
    console.log('Prospek Baru Ditangkap:', validatedFields.data);

    return {
      message: `Terima kasih, ${validatedFields.data.name}! Kami telah menerima informasi Anda dan akan segera menghubungi Anda.`,
    };
  } catch (error) {
    console.error('Kesalahan menangkap prospek:', error);
    return {
      message: 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.',
    };
  }
}


export async function getPersonalizedOffer(
  prevState: PersonalizedOfferFormState,
  formData: FormData
): Promise<PersonalizedOfferFormState> {
  const validatedFields = PersonalizedOfferSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Silakan periksa masukan Anda.',
      issues: validatedFields.error.flatten().formErrors,
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const recommendation = await personalizedOfferRecommendations(validatedFields.data);
    return { recommendation };
  } catch (e) {
    console.error(e);
    return { message: "Maaf, kami tidak dapat membuat rekomendasi saat ini. Silakan coba lagi." };
  }
}
