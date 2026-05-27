import {getMood} from '../service/song.api.js'
import {useContext} from 'react'
import { SongContext } from '../song.context.jsx'


export const useSong = () => {
    const {song, setSong, loading, setLoading} = useContext(SongContext)

    async function handleGetSong({mood}){
      try{  setLoading(true)
        const data = await getMood({mood})
        setSong(data.songs[0])
        console.log("Fetched song data:", data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching songs:", error)
        setLoading(false)
      }
    }

    return({
        song,
        loading,
        handleGetSong
    })
}