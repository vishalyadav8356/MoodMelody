import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import './features/shared/styles/global.css'
import Protected from './features/auth/components/Protected'
import Home from './features/home/pages/Home' 

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Protected><Home /></Protected>} />
    </Routes>
  )
}

export default App