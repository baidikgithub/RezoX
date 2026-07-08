"use client";

import { create } from "zustand";
import type { Listing } from "./api";

type MemoryState = {
  compare: Listing[];
  recent: Listing[];
  savedSearches: string[];
  addCompare: (listing: Listing) => void;
  removeCompare: (id: string | number) => void;
  addRecent: (listing: Listing) => void;
  saveSearch: (query: string) => void;
};

export const usePropertyMemory = create<MemoryState>((set, get) => ({
  compare: [],
  recent: [],
  savedSearches: [],
  addCompare: (listing) => {
    const exists = get().compare.some(item => String(item.id || item._id) === String(listing.id || listing._id));
    if (exists) return;
    set({ compare: [...get().compare, listing].slice(-3) });
  },
  removeCompare: (id) => set({ compare: get().compare.filter(item => String(item.id || item._id) !== String(id)) }),
  addRecent: (listing) => set({ recent: [listing, ...get().recent.filter(item => String(item.id || item._id) !== String(listing.id || listing._id))].slice(0, 8) }),
  saveSearch: (query) => {
    if (!query) return;
    const searches = [query, ...get().savedSearches.filter(item => item !== query)].slice(0, 8);
    set({ savedSearches: searches });
  }
}));
