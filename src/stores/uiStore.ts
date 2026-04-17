import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  cartOpen: boolean;
  notificationsOpen: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  cartOpen: false,
  notificationsOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  setCartOpen: (open) => set({ cartOpen: open }),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
