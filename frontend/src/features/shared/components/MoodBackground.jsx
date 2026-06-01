import { moodTheme } from '../utils/moodTheme'
import PropTypes from 'prop-types'

const MoodBackground = ({ emotion }) => {
  const theme = moodTheme[emotion] || moodTheme.default
  const orbs = theme.orbs

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#09090b'
      }}
    >
      {orbs.map((color, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.35,
            width: i === 0 ? '500px' : i === 1 ? '400px' : '300px',
            height: i === 0 ? '500px' : i === 1 ? '400px' : '300px',
            background: color,
            top: i === 0 ? '-100px' : i === 1 ? 'auto' : '30%',
            bottom: i === 1 ? '-100px' : 'auto',
            left: i === 0 ? '-100px' : i === 2 ? '60%' : 'auto',
            right: i === 1 ? '-50px' : 'auto',
            animation: `float${i + 1} ${4 + i}s ease-in-out infinite`,
            transition: 'background 1s ease'
          }}
        />
      ))}

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.15); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(0.9); }
        }
      `}</style>
    </div>
  )
}

MoodBackground.propTypes = {
  emotion: PropTypes.string,
}

export default MoodBackground