// We will save the theme to the local storage so that every time we refresh, we will still have the theme
import { create } from "zustand";

// hook
export const useThemeStore = create((set) => ({

    // chat-theme is the storage element that holds the theme in the device's local storage
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme) => {
        // Storing the theme in local storage
        localStorage.setItem("chat-theme", theme);
        // Setting the theme of the app
        set({ theme })
    }
}))