import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "receptionist" | "cleaner" | "manager"
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        if (email === "admin@hotel.com" && password === "admin123") {
          const user: User = {
            id: "1",
            name: "Admin User",
            email: "admin@hotel.com",
            role: "admin",
          }
          set({ user, isAuthenticated: true })
          return true
        } else if (email === "receptionist@hotel.com" && password === "receptionist123") {
          const user: User = {
            id: "2",
            name: "Receptionist User",
            email: "receptionist@hotel.com",
            role: "receptionist",
          }
          set({ user, isAuthenticated: true })
          return true
        } else if (email === "manager@hotel.com" && password === "manager123") {
          const user: User = {
            id: "3",
            name: "Manager User",
            email: "manager@hotel.com",
            role: "manager",
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      checkAuth: () => {
        return get().isAuthenticated
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
