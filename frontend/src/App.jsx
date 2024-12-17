import Navbar from "./components/Navbar"
import { Routes, Route, Navigate } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import AddFriends from "./pages/AddFriends"


const App = () => {

  // Calling the hook and destructuring the value
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log("Online Users")
  console.log(onlineUsers)

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({ authUser })

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>

      {/* We want the Navbar on every page */}
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        {/* The login and signup pages should be visible only to unauthenticated users. If authenticated, they should be redirected
            to the home page */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/add-friends" element={<AddFriends />} />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </div>
  )
}

export default App