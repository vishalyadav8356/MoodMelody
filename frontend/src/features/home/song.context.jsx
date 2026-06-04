import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line react-refresh/only-export-components
export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState(null)

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

