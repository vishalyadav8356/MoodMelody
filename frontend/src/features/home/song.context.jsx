import { createContext, useState } from 'react'

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: 'https://ik.imagekit.io/m1knczwsx/cohort2/moodify/songs/I_Really_Do__RiskyjaTT.CoM__tIapZKACI.mp3',
    posterUrl: 'https://ik.imagekit.io/m1knczwsx/cohort2/moodify/posters/I_Really_Do__RiskyjaTT.CoM__wW9wIqIlJ.jpeg',
    title: 'I Really Do (RiskyjaTT.CoM)',
    mood: 'happy',
  })

  const [loading, setLoading] = useState(false)

  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  )
}
