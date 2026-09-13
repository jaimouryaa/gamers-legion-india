"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  coverImage: string | null;
  genre: string[];
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const STORAGE_KEY = "gli:cart";

function loadInitial(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

let state: CartState = { items: [], isOpen: false };
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

const SERVER_SNAPSHOT: CartState = { items: [], isOpen: false };

function getServerSnapshot(): CartState {
  return SERVER_SNAPSHOT;
}

let hydrated = false;
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = { ...state, items: loadInitial() };
}

export const cartActions = {
  add(item: CartItem) {
    ensureHydrated();
    if (state.items.some((i) => i.id === item.id)) {
      state = { ...state, isOpen: true };
      emit();
      return;
    }
    state = { items: [...state.items, item], isOpen: true };
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

export function useCart() {
  ensureHydrated();
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    items: snap.items,
    count: snap.items.length,
    total: snap.items.reduce((sum, i) => sum + i.price, 0),
    isOpen: snap.isOpen,
    addItem: cartActions.add,
    removeItem: cartActions.remove,
    clear: cartActions.clear,
    open: cartActions.open,
    close: cartActions.close,
  };
}
