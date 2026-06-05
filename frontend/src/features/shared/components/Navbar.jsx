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
    { label: 'Liked', path: '/liked' }
  ]

  const logout = async () => {
    await handleLogout()
    navigate('/login')
  }

  return (
    <nav className="w-full h-14 px-4 md:px-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10 relative z-50">

      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        className="font-bold text-xl cursor-pointer tracking-tight"
        style={{ color: accent }}
      >
        Mood Melody
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-3">

        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              location.pathname === item.path
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

          <span className="text-sm text-white/70">
            {user?.username}
          </span>
        </div>

        <button
          onClick={logout}
          className="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          Logout
        </button>

      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-2xl"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 flex flex-col gap-1 p-4 md:hidden">

          <div className="flex items-center gap-2 pb-3 border-b border-white/10">

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: accent }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </div>

            <span className="text-sm text-white/70">
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
              className={`text-left px-3 py-2 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={logout}
            className="text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  )
}

export default Navbar

