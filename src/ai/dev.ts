'use client';
/**
 * @fileoverview This file defines the Genkit flow for internet plan comparison.
 *
 * It takes a user's current internet provider, price, and speed test results,
 * and returns an AI-generated comparison highlighting the benefits of switching
 * to MyRepublic.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-offer-recommendations.ts';
import '@/ai/flows/blog-post-generator.ts';
import '@/ai/flows/internet-comparison-flow.ts';
