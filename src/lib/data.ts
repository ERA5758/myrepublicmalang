import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/coverage-check", label: "Coverage" },
  { href: "/personalized-offers", label: "Get Recommendation" },
];

type Offer = {
  id: string;
  title: string;
  description: string;
  speed: string;
  features: string[];
  image: ImagePlaceholder | undefined;
};

export const offers: Offer[] = [
  {
    id: "gamer-pro",
    title: "Gamer Pro",
    speed: "500 Mbps",
    description: "Engineered for victory with ultra-low latency and maximum bandwidth for seamless gaming and streaming.",
    features: ["Lowest Latency", "Symmetrical Upload/Download", "Free Gaming Router"],
    image: PlaceHolderImages.find(img => img.id === 'gamer-pro'),
  },
  {
    id: "family-stream",
    title: "Family Stream",
    speed: "300 Mbps",
    description: "The perfect balance of speed and reliability for the whole family. Stream, study, and surf on multiple devices without lag.",
    features: ["Unlimited Quota", "Stable Connection", "Connects up to 15 devices"],
    image: PlaceHolderImages.find(img => img.id === 'family-stream'),
  },
  {
    id: "basic-connect",
    title: "Basic Connect",
    speed: "100 Mbps",
    description: "Affordable, high-speed internet for your daily needs. Ideal for browsing, social media, and streaming in HD.",
    features: ["Best Value", "Reliable Fiber Optic", "24/7 Customer Support"],
    image: PlaceHolderImages.find(img => img.id === 'basic-connect'),
  },
];

type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What is MyRepublic?",
    answer: "MyRepublic is a fiber optic internet provider offering high-speed broadband services. We are dedicated to providing fast, reliable, and affordable internet to residents of Malang.",
  },
  {
    question: "What are the benefits of MyRepublic fiber internet?",
    answer: "Our fiber optic network provides symmetrical upload and download speeds, lower latency, and a more stable connection compared to traditional cable internet. This is ideal for gaming, streaming 4K content, video conferencing, and supporting multiple connected devices.",
  },
  {
    question: "How do I check for coverage in my area in Malang?",
    answer: "You can use our Coverage Check tool on our website. Simply enter your full address to see if our service is available at your location and explore the available plans.",
  },
  {
    question: "What plans are available?",
    answer: "We offer a variety of plans to suit different needs and budgets, from our Basic Connect plan for everyday browsing to our Gamer Pro plan for competitive online gaming. You can see our featured offers on the homepage.",
  },
  {
    question: "How do I get a personalized recommendation?",
    answer: "Use our AI-Powered Offer Customization Tool! By providing your address and describing your internet usage, our AI will suggest the best plan tailored specifically for you.",
  }
];
