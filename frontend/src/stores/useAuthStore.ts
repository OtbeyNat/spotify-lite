// import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
	isLoading: boolean;
	error: string | null;
	expires: Date
}

export const useAuthStore = create<AuthStore>(() => ({
	isLoading: false,
	error: null,
	accessToken: null,
	refreshToken: null,
	expires: new Date(0),

}));