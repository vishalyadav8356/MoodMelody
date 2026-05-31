import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import './features/shared/styles/global.css'
import Protected from './features/auth/components/Protected'
import Home from './features/home/pages/Home'
import LikedSong from './features/home/pages/LikedSong'
import MoodHistory from './features/home/pages/MoodHistory'
import MoodBackground from './features/shared/components/MoodBackground'
import Navbar from './features/shared/components/Navbar'
import { useSong } from './features/home/hooks/useSong'
import BottomNav from './features/shared/components/BottomNav'


const App = () => {
  const { emotion } = useSong()
  return (
    <div className="relative min-h-screen bg-zinc-950">

        <MoodBackground emotion={emotion} />


      <div className="relative z-10 flex flex-col overflow-hidde" style={{ height: '100vh' }}>
        <Navbar/>
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<Protected><Home /></Protected>} />
            <Route path='/liked' element={<Protected><LikedSong /></Protected>} />
            <Route path='/history' element={<Protected><MoodHistory /></Protected>} />
          </Routes>
        </div>
      </div>


    <BottomNav/>
    </div>  
  )
}

export default App