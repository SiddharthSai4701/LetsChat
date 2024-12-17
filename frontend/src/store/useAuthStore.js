import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set, get) => ({

    // Initially auth user state will be null because we do not know whether the user is authenticated or not
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    onlineUsers: [],
    isUpdatingProfile: false,

    // This will be true because as soon as we refresh the page we will begin checking if the user is authenticated or not
    isCheckingAuth: true,

    // STate of the socket
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
            get().connectSocket(); // Once authenticated we want to connect to the socket
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            // Once we login we want to immediately connect to a socket
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error("Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {

        // If the user is not authenticated or already connected, do not even attempt to make the connection
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        // The query object will be used by the server after handshake
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({ socket: socket })

        // The getOnlineUsers event returns the user IDs of all active users which we will use in our callback
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },
    disconnectSocket: () => {
        // Only if connected, try to disconnect
        if (get().socket?.connected) get().socket.disconnect();
    }
}));