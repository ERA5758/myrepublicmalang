import { z } from "zod";

export const LeadCaptureSchema = z.object({
  name: z.string().min(2, { message: "Nama harus terdiri dari minimal 2 karakter." }),
  email: z.string().email({ message: "Silakan masukkan alamat email yang valid." }),
  phone: z.string().min(10, { message: "Silakan masukkan nomor telepon yang valid." }),
  address: z.string().min(10, { message: "Silakan masukkan alamat lengkap." }),
  locationPin: z.string().optional(),
  selectedPlan: z.string({ required_error: "Silakan pilih salah satu paket." }).min(1, { message: "Silakan pilih salah satu paket." }),
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


type ImagePlaceholder = {
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Offer = {
  id: string;
  title: string;
  price: string;
  speed: string;
  features: string[];
  image: ImagePlaceholder;
  promo?: string;
};

export type OfferTV = {
  id: string;
  title: string;
  price: string;
  speed: string;
  features: string[];
  image: ImagePlaceholder;
  promo?: string;
  channels: string;
  stb: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  category: string;
  image: ImagePlaceholder;
};
