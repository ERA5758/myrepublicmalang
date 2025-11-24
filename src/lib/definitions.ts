import { z } from "zod";

export const LeadCaptureSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(10, { message: "Please enter a complete address." }),
});

export type LeadCaptureFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
} | null;


export const PersonalizedOfferSchema = z.object({
  address: z.string().min(10, {
    message: "Please enter a valid address in Malang.",
  }),
  internetUsageHabits: z.string().min(10, {
    message: "Please describe your internet usage (e.g., gaming, streaming, work).",
  }),
});

export type PersonalizedOfferFormState = {
  recommendation?: {
    recommendedPlanName: string;
    recommendedPlanDescription: string;
  };
  message?: string;
  issues?: string[];
  fields?: Record<string, string>;
};
