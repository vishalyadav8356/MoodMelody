import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import './features/shared/styles/global.css'
import Protected from './features/auth/components/Protected'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Protected><h1 className='text-white text-3xl'>Welcome to the Auth App</h1></Protected>} />
    </Routes>
  )
}

export default App