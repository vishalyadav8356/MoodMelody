import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line react-refresh/only-export-components
export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: 'https://ik.imagekit.io/m1knczwsx/cohort2/moodify/songs/I_Really_Do__RiskyjaTT.CoM__tIapZKACI.mp3',
    posterUrl: 'https://ik.imagekit.io/m1knczwsx/cohort2/moodify/posters/I_Really_Do__RiskyjaTT.CoM__wW9wIqIlJ.jpeg',
    title: 'I Really Do (RiskyjaTT.CoM)',
    mood: 'happy',
  })

  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [emotion, setEmotion] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)


  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading, isLiked, setIsLiked, emotion, setEmotion, confidence, setConfidence,  queue, setQueue,   queueIndex, setQueueIndex }}>
      {children}
    </SongContext.Provider>
  )
}

SongContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
