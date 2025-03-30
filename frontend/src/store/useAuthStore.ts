import { create } from "zustand";

export type AuthStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated?: boolean) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem("access_token"),
  setIsAuthenticated: (
    isAuthenticated = !!localStorage.getItem("access_token")
  ) => {
    set({ isAuthenticated });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
