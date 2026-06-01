import { useNavigate, useLocation } from 'react-router-dom'
import { useSong } from '../../home/hooks/useSong'
import { moodTheme } from '../utils/moodTheme'

const BottomNav = () => {
  const { emotion } = useSong()
  const navigate = useNavigate()
  const location = useLocation()

  const theme = moodTheme[emotion] || moodTheme.default
  const accent = theme.accent

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Liked', icon: '❤️', path: '/liked' },
    { label: 'History', icon: '🕐', path: '/history' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition"
              style={{ color: isActive ? accent : 'rgba(255,255,255,0.4)' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav