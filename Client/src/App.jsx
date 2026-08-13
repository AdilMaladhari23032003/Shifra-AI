import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import ProtectedRoute from './Components/ProtectedRoute'
import Navbar from './Components/Navbar'
import { Toaster } from "react-hot-toast"

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Builder = lazy(() => import('./pages/Builder'))
const Billing = lazy(() => import('./pages/Billing'))

export const ServerUrl = import.meta.env.MODE === "production"
  ? "https://shifra-ai.onrender.com"
  : "http://localhost:8000"

export const CLIENT_URL = import.meta.env.MODE === "production"
  ? "https://shifra-ai-pmvc.onrender.com"
  : "http://localhost:5173"

function App() {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('shifra_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })

  // Start with loading = false if user is cached or if there's no auth session hinted
  const [authChecked, setAuthChecked] = useState(() => {
    return !!localStorage.getItem('shifra_user_checked');
  })

  const updateUserState = (newUser) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem('shifra_user', JSON.stringify(newUser));
        localStorage.setItem('shifra_user_checked', 'true');
      } else {
        localStorage.removeItem('shifra_user');
        localStorage.removeItem('shifra_user_checked');
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      try {
        const res = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
        if (isMounted) {
          updateUserState(res.data);
          setAuthChecked(true);
        }
      } catch (error) {
        if (isMounted) {
          updateUserState(null);
          setAuthChecked(true);
        }
      }
    }
    fetchMe();
    return () => { isMounted = false; };
  }, [])

  return (
    <>
      <Toaster position='top-right'/>
      <Suspense fallback={
        <div className='min-h-screen flex items-center justify-center bg-[#f8f8fc]'>
          <div className='w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'/>
        </div>
      }>
        <Routes>
          <Route path='/login' element={<Login setUser={updateUserState}/>} />

          <Route path='/*' element={<ProtectedRoute user={user} loading={!user && !authChecked}>
            <Navbar setUser={updateUserState} user={user}/>
            <Routes>
              <Route path='/' element={<Home user={user}/>} />
              <Route path='/builder' element={<Builder user={user} setUser={updateUserState}/>}/>
              <Route path='/billing' element={<Billing user={user} setUser={updateUserState}/>}/>
              <Route path='*' element={<Navigate to="/" replace/>}/>
            </Routes>
          </ProtectedRoute>} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
