"use client";

import { useSyncExternalStore } from "react";

export interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  coverImage: string | null;
  genre: string[];
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

const STORAGE_KEY = "gli:wishlist";
const SERVER_SNAPSHOT: WishlistState = { items: [], isOpen: false };

function loadInitial(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

let state: WishlistState = { items: [], isOpen: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

let hydrated = false;
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = { ...state, items: loadInitial() };
}

export const wishlistActions = {
  toggle(item: WishlistItem) {
    ensureHydrated();
    const exists = state.items.some((i) => i.id === item.id);
    state = {
      ...state,
      items: exists ? state.items.filter((i) => i.id !== item.id) : [...state.items, item],
    };
    emit();
  },
  remove(id: string) {
    state = { ...state, items: state.items.filter((i) => i.id !== id) };
    emit();
  },
  clear() {
    state = { ...state, items: [] };
    emit();
  },
  open() {
    state = { ...state, isOpen: true };
    emit();
  },
  close() {
    state = { ...state, isOpen: false };
    emit();
  },
};

export function useWishlist() {
  ensureHydrated();
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    items: snap.items,
    count: snap.items.length,
    isOpen: snap.isOpen,
    isWishlisted: (id: string) => snap.items.some((i) => i.id === id),
    toggle: wishlistActions.toggle,
    remove: wishlistActions.remove,
    clear: wishlistActions.clear,
    open: wishlistActions.open,
    close: wishlistActions.close,
  };
}
