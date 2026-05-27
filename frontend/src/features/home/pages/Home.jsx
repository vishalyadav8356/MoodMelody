import React from 'react'
import FaceExpression from '../../Expression/pages/FaceExpression'
import Player from '../components/Player'
import {useSong} from '../hooks/useSong'

const Home = () => {

    const {handleGetSong} = useSong()

  return (
    <div className='flex flex-col items-center  h-screen gap-8'>
        <FaceExpression onClick={(expression) => handleGetSong({mood : expression})} />
        <Player/>
    </div>
  )
}

export default Home