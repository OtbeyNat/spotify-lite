import { Route, Routes } from "react-router-dom"
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import { Toaster } from "react-hot-toast"
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage"
import HomePage from "./pages/home/HomePage"
import MainLayout from "./layout/MainLayout"
import ChatPage from "./pages/chat/ChatPage"
import AlbumPage from "./pages/album/AlbumPage"
import AdminPage from "./pages/admin/AdminPage"
import NotFoundPage from "./pages/not-found/NotFoundPage"
import SearchPage from "./pages/search/SearchPage"

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage/>}/>
          <Route path="/*" element={<NotFoundPage/>}/>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
