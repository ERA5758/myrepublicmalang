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
      message: 'Invalid form data. Please check your inputs.',
      issues: validatedFields.error.flatten().fieldErrors ? undefined : validatedFields.error.flatten().formErrors,
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Here you would typically save the lead data to a database like Firestore.
    // For this example, we'll just log it to the console.
    console.log('New Lead Captured:', validatedFields.data);

    return {
      message: `Thank you, ${validatedFields.data.name}! We've received your information and will be in touch shortly.`,
    };
  } catch (error) {
    console.error('Error capturing lead:', error);
    return {
      message: 'An unexpected error occurred. Please try again later.',
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
      message: 'Please check your inputs.',
      issues: validatedFields.error.flatten().formErrors,
      fields: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const recommendation = await personalizedOfferRecommendations(validatedFields.data);
    return { recommendation };
  } catch (e) {
    console.error(e);
    return { message: "Sorry, we couldn't generate a recommendation at this time. Please try again." };
  }
}