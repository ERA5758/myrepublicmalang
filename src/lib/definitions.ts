

import { z } from "zod";

export const LeadStatusEnum = z.enum(["Proses", "Cancel", "Reject", "Tidak Cover", "Done"]);

export const LeadCaptureSchema = z.object({
  name: z.string().min(2, { message: "Nama harus terdiri dari minimal 2 karakter." }),
  email: z.string().email({ message: "Silakan masukkan alamat email yang valid." }),
  phone: z.string().min(10, { message: "Silakan masukkan nomor telepon yang valid." }),
  area: z.string({ required_error: "Silakan pilih area Anda." }).min(1, { message: "Silakan pilih area Anda." }),
  address: z.string().min(10, { message: "Silakan masukkan alamat lengkap." }),
  locationPin: z.string().min(1, { message: "Silakan ambil pin lokasi GPS Anda." }),
  selectedPlan: z.string({ required_error: "Silakan pilih salah satu paket." }).min(1, { message: "Silakan pilih salah satu paket." }),
  promo_prepaid: z.string().optional(),
  promo_speed_boost: z.string().optional(),
  promo_free_installation: z.string().optional(),
  status: LeadStatusEnum.default("Proses"),
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

export const ReviewSchema = z.object({
  name: z.string().min(2, { message: "Nama harus terdiri dari minimal 2 karakter." }),
  review: z.string().min(10, { message: "Ulasan harus terdiri dari minimal 10 karakter." }),
  rating: z.coerce.number().min(1, { message: "Rating tidak boleh kosong."}).max(5),
});

export type ReviewFormState = {
  isSuccess: boolean;
  message: string;
  fields?: Partial<z.infer<typeof ReviewSchema>>;
  issues?: string[];
} | null;


export type ImagePlaceholder = {
  id: string;
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

export type MyGamerPackage = {
    id: string;
    tier: string;
    speed: string;
    price: string;
    features: string[];
    image: ImagePlaceholder;
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

export type AddOn = {
  id: string;
  category: 'perangkat' | 'tv' | 'smart-home' | 'speed-booster';
  title: string;
  description?: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  features?: string[];
  notes?: string;
};

export type CarouselSlide = {
    id: string;
    title: string;
    description: string;
    image: ImagePlaceholder;
}

export type Review = {
    id: string;
    name: string;
    review: string;
    rating: number;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    area: string;
    address: string;
    selectedPlan: string;
    locationPin: string;
    createdAt: string;
    promos?: string[];
    status: z.infer<typeof LeadStatusEnum>;
};
