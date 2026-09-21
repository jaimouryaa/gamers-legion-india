export type GameStatus = "active" | "draft" | "archived" | "expired";

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  genre: string[];
  platforms: string[];
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  savings: number;
  rating: number | null;
  reviewCount: number | null;
  releaseDate: string | null;
  dealExpiry: string | null;
  featured: boolean;
  status: GameStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GameInput {
  title: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  bannerImage?: string;
  genre: string[];
  platforms: string[];
  originalPrice: number;
  salePrice: number;
  rating?: number;
  reviewCount?: number;
  releaseDate?: string;
  dealExpiry?: string;
  featured: boolean;
  status: GameStatus;
  tags?: string[];
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string | null;
  gameIds: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercentage: number;
  savings: number;
  rating: number | null;
  featured: boolean;
  status: GameStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BundleInput {
  name: string;
  description: string;
  bannerImage?: string;
  gameIds: string[];
  originalPrice: number;
  bundlePrice: number;
  rating?: number;
  featured: boolean;
  status: GameStatus;
  expiresAt?: string;
}

export interface Proof {
  id: string;
  imageUrl: string;
  caption: string | null;
  gameId: string | null;
  gameTitle?: string | null; // joined in for display, not a real column
  gameSlug?: string | null;
  published: boolean;
  createdAt: string;
}

export interface ProofInput {
  imageUrl: string;
  caption?: string;
  gameId?: string | null;
  published: boolean;
}

export const GENRES = [
  "Action",
  "RPG",
  "Adventure",
  "Indie",
  "Strategy",
  "Racing",
  "Simulation",
  "Sports",
  "Horror",
] as const;

export const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo Switch"] as const;
