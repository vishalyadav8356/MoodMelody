import React from 'react'
import FaceExpression from '../../Expression/pages/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const { handleGetSong, setEmotion } = useSong()
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center  h-screen gap-8'>
      <div className="w-full flex justify-end px-6 pt-4 gap-3">
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition text-sm"
        >
          🕐 History
        </button>
        <button
          onClick={() => navigate('/liked')}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition text-sm"
        >
          ❤️ Liked Songs
        </button>
      </div>
      <FaceExpression onClick={(expression) => {
        handleGetSong({ mood: expression })
        setEmotion(expression)
      }} />
      <Player />
    </div>
  )
}

export default Home