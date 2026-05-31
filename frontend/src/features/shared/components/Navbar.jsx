import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSong } from '../../home/hooks/useSong'
import { moodTheme } from '../utils/moodTheme'

const Navbar = () => {
  const { user, handleLogout } = useAuth()
  const { emotion } = useSong()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const theme = moodTheme[emotion] || moodTheme.default
  const accent = theme.accent

  const navItems = [
    { label: 'History', icon: '🕐', path: '/history' },
    { label: 'Liked', icon: '❤️', path: '/liked' },
  ]

  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">

      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        className="font-bold text-xl cursor-pointer tracking-tight transition"
        style={{ color: accent }}
      >
        Moodify
      </h1>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="px-3 py-1.5 text-sm rounded-lg transition font-medium"
              style={{
                background: isActive ? `${accent}25` : 'rgba(255,255,255,0.08)',
                color: isActive ? accent : 'rgba(255,255,255,0.6)',
              }}
            >
              {item.icon} {item.label}
            </button>
          )
        })}

        <div className="w-px h-5 bg-white/20 mx-1" />

        {/* User */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: `${accent}15` }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
            style={{ background: accent }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium" style={{ color: accent }}>
            {user?.username}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-white/50 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white/70 text-xl"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/10 flex flex-col gap-1 px-4 py-3 z-50 md:hidden">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: accent }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-white/60">{user?.username}</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false) }}
              className="text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded-lg transition"
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition mt-1"
          >
            🚪 Logout
          </button>
        </div>
      )}

    </nav>
  )
}

export default Navbar