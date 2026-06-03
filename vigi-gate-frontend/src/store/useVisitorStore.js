import { create } from 'zustand';
import { visitorApi } from '../services/api';

const useVisitorStore = create((set) => ({
    activeVisitors: [],
    history: [],
    loading: false,
    error: null,

    fetchActiveVisitors: async () => {
        set({ loading: true, error: null });
        try {
            const response = await visitorApi.getActive();
            set({ activeVisitors: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    checkoutVisitor: async (id) => {
        try {
            await visitorApi.checkout(id);
            set((state) => ({
                activeVisitors: state.activeVisitors.filter(v => v.id !== id)
            }));
        } catch (error) {
            console.error('Failed to checkout:', error);
        }
    }
}));

export default useVisitorStore;
