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
  tab: 'profile',
  openProfile: (tab) => set({ open: true, tab: tab ?? 'profile' }),
  closeProfile: () => set({ open: false }),
  setTab: (tab) => set({ tab })
}));
