import { create } from 'zustand';

interface AuthStore {
  open: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  open: false,
  openAuthModal: () => set({ open: true }),
  closeAuthModal: () => set({ open: false })
}));
