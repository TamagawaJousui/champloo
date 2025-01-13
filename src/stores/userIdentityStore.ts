import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface IdentityStore {
  visitorId: string | null;
  getVisitorId: () => string;
}

export const useIdentityStore = create<IdentityStore>()(
  persist(
    (set, get) => ({
      visitorId: null,
      getVisitorId: () => {
        const currentId = get().visitorId;
        if (currentId) return currentId;
        
        const newId = uuidv4();
        set({ visitorId: newId });
        return newId;
      }
    }),
    {
      name: 'user-identity'
    }
  )
); 