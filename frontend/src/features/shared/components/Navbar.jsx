import { useState } from 'react'
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
    { label: 'Home', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Liked', path: '/liked' },

  ]


  return (
    <nav className="w-full px-4 md:px-6 h-10 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10 relative z-40">

      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        className="font-bold text-xl cursor-pointer tracking-tight"
        style={{ color: accent }}
      >
        Moodify
      </h1>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 ml-auto">

        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-3 py-2 rounded-lg text-sm transition ${location.pathname === item.path
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            {item.label}
          </button>
        ))}

        {/* User */}
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black"
            style={{ background: accent }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </div>

          <span className="text-sm text-white/60">
            {user?.username}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          Logout
        </button>

      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white/70 text-xl"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-10 left-0 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/10 flex flex-col gap-1 px-4 py-3 z-50 md:hidden">

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: accent }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>

            <span className="text-sm text-white/60">
              {user?.username}
            </span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setMenuOpen(false)
              }}
              className="text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded-lg transition"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  )
}

export default Navbar