import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
      setDark: (dark: boolean) => set({ isDark: dark })
    }),
    {
      name: 'theme-storage'
    }
  )
);
