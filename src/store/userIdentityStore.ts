import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface IdentityStore {
  visitorId: string;
}

const generateInitialState = (): IdentityStore => ({
  visitorId: uuidv4(), // 这个只会在没有持久化数据时执行
});

export const useIdentityStore = create<IdentityStore>()(
  persist(generateInitialState, {
    name: "user-identity",
  })
);
