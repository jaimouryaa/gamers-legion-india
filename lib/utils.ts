import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calcDiscount(originalPrice: number, salePrice: number) {
  const savings = Math.max(originalPrice - salePrice, 0);
  const discountPercentage =
    originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;
  return { savings, discountPercentage };
}

// Media (cover/banner) URLs can point at an image, a GIF, or now a short
// video clip — there's no separate "media type" column in the database, so
// we infer it from the file extension both here and wherever it's uploaded.
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Builds a wa.me link that opens a prefilled WhatsApp chat with the store
 * number, instead of a real checkout flow.
 */
export function buildWhatsAppLink(params: {
  gameTitle: string;
  price: number;
  slug?: string;
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const link = params.slug ? `${origin}/games/${params.slug}` : "";
  const message = [
    `Hi Gamers Legion India, I'd like to buy:`,
    `${params.gameTitle} — ${formatINR(params.price)}`,
    link ? link : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!number) {
    // Falls back to a harmless anchor if the store hasn't configured a number yet.
    return "#";
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppBundleLink(bundle: { name: string; price: number; slug?: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = bundle.slug ? `${origin}/bundles/${bundle.slug}` : "";
  const message = [
    `Hi Gamers Legion India, I'd like to buy the bundle:`,
    `${bundle.name} — ${formatINR(bundle.price)}`,
    link,
  ]
    .filter(Boolean)
    .join("\n");

  if (!number) return "#";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppGeneralLink() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return "#";
  const message = "Hi Gamers Legion India, I have a question about a game.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCartLink(
  items: { title: string; price: number }[]
) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number || items.length === 0) return "#";

  const lines = items.map((i) => `• ${i.title} — ${formatINR(i.price)}`);
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const message = [
    `Hi Gamers Legion India, I'd like to buy:`,
    ...lines,
    ``,
    `Total: ${formatINR(total)}`,
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function timeUntil(dateIso: string) {
  return timeUntilFrom(dateIso, Date.now());
}

export function timeUntilFrom(dateIso: string, now: number) {
  const diff = new Date(dateIso).getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}
