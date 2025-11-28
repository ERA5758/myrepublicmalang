
'use server';

import { z } from 'zod';
import { personalizedOfferRecommendations } from '@/ai/flows/personalized-offer-recommendations';
import { LeadCaptureSchema, PersonalizedOfferSchema, type LeadCaptureFormState, type PersonalizedOfferFormState } from './definitions';
import { sendLeadNotification } from './whatsapp';
import { addDoc, collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
      issues: validatedFields.error.flatten().formErrors,
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        throw new Error('Firestore is not initialized.');
    }

    const leadsCollection = collection(firestore, 'leads');
    await addDoc(leadsCollection, {
        ...validatedFields.data,
        createdAt: serverTimestamp()
    });

    // --- Prepare data for notification ---
    const offersCollection = collection(firestore, 'offers');
    const offersTVCollection = collection(firestore, 'offersTV');
    
    const [offersSnapshot, offersTVSnapshot] = await Promise.all([
        getDocs(query(offersCollection)),
        getDocs(query(offersTVCollection))
    ]);

    const allPackages = [
        ...offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...offersTVSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];
    
    const selectedPlan = allPackages.find(pkg => pkg.id === validatedFields.data.selectedPlan);
    
    const leadDataForNotif = {
        ...validatedFields.data,
        selectedPlan: selectedPlan ? `${selectedPlan.title} - ${selectedPlan.speed}` : validatedFields.data.selectedPlan,
    };

    await sendLeadNotification(leadDataForNotif);

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

    
