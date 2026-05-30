// features/home/hooks/useLikedSongs.js

import { useState, useEffect } from "react";
import { getLikedSongs } from "../service/song.api.js";

const MOODS = ['all', 'happy', 'sad', 'surprised']

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState('all')


  useEffect(() => {
  async function fetchLikedSongs() {
    try {
      setLoading(true)
      const data = await getLikedSongs(selectedMood  === 'all' ? '' : selectedMood )
      setLikedSongs(data.songs)
    } catch (error) {
      console.error("Error fetching liked songs:", error)
      setLikedSongs([])
    } finally {
      setLoading(false)
    }
  }

  fetchLikedSongs()
    }, [selectedMood])



  return {
    likedSongs,
    loading,
    selectedMood,
    setSelectedMood,
    MOODS
  }
}