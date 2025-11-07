import { create } from 'zustand';

// Mock data for perfumes
export const PERFUMES = {
  'ocean_blue': { name: 'Ocean Blue', pricePerPump: 3.5, scent: 'Fresh, Citrus, Marine', icon: 'Sun' },
  'rose_mist': { name: 'Rose Mist', pricePerPump: 3.2, scent: 'Floral, Sweet, Romantic', icon: 'Heart' },
  'night_amber': { name: 'Night Amber', pricePerPump: 4.0, scent: 'Spicy, Musky, Deep Wood', icon: 'Moon' },
};

// Define the Zustand store
export const useKioskStore = create((set, get) => ({
  // --- STATE ---
  screen: 'SELECT', // 'SELECT', 'PAYMENT', 'DISPENSE', 'COMPLETE'
  selectedPerfumeId: 'ocean_blue',
  pumps: 5,
  order: null, // Will hold { id, perfumeName, pumps, amount, status, qrCodeUrl, etc. }
  
  // --- ACTIONS ---
  
  /**
   * Selects a perfume.
   */
  selectPerfume: (perfumeId) => set({ selectedPerfumeId: perfumeId }),
  
  /**
   * Sets the number of pumps.
   */
  setPumps: (pumps) => set({ pumps: Number(pumps) }),
  
  /**
   * Stores the order details received from the backend.
   */
  setOrder: (orderData) => set({ order: orderData, screen: 'PAYMENT' }),

  /**
   * Updates the status of the current order (e.g., 'CREATED' -> 'PAID').
   */
  setOrderStatus: (status) => set((state) => ({
    order: state.order ? { ...state.order, status } : null,
  })),

  /**
   * Navigates to a new screen.
   */
  setScreen: (screen) => set({ screen }),

  /**
   * Resets the entire flow to the beginning.
   */
  reset: () => set({
    screen: 'SELECT',
    selectedPerfumeId: 'ocean_blue',
    pumps: 5,
    order: null,
  }),
  
  // --- SELECTORS (as getters for convenience) ---
  
  /**
   * Gets the full object for the currently selected perfume.
   */
  getSelectedPerfume: () => {
    const id = get().selectedPerfumeId;
    return PERFUMES[id] || null;
  },

  /**
   * Calculates the total price for the current selection.
   */
  getTotalPrice: () => {
    const perfume = PERFUMES[get().selectedPerfumeId];
    const pumps = get().pumps;
    if (!perfume) return 0;
    return (perfume.pricePerPump * pumps).toFixed(2);
  },
}));