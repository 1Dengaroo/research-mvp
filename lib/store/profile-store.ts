import { create } from 'zustand';

interface ProfileStore {
  open: boolean;
  tab: string;
  openProfile: (tab?: string) => void;
  closeProfile: () => void;
  setTab: (tab: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  open: false,
  tab: 'appearance',
  openProfile: (tab) => set({ open: true, tab: tab ?? 'appearance' }),
  closeProfile: () => set({ open: false }),
  setTab: (tab) => set({ tab })
}));
