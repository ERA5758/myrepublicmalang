import { z } from "zod";

export const LeadCaptureSchema = z.object({
  name: z.string().min(2, { message: "Nama harus terdiri dari minimal 2 karakter." }),
  email: z.string().email({ message: "Silakan masukkan alamat email yang valid." }),
  phone: z.string().min(10, { message: "Silakan masukkan nomor telepon yang valid." }),
  address: z.string().min(10, { message: "Silakan masukkan alamat lengkap." }),
  locationPin: z.string().optional(),
});

export type LeadCaptureFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
} | null;


export const PersonalizedOfferSchema = z.object({
  address: z.string().min(10, {
    message: "Silakan masukkan alamat yang valid di Malang.",
  }),
  internetUsageHabits: z.string().min(10, {
    message: "Harap jelaskan penggunaan internet Anda (mis., bermain game, streaming, bekerja).",
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
