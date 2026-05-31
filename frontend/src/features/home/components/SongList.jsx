import React, { useState, useEffect } from 'react'
import { getAllSongs } from '../service/song.api'
import { useSong } from '../hooks/useSong'

const MOODS = ['all', 'happy', 'sad', 'surprised']
const MOOD_EMOJI = { all: '🎵', happy: '😊', sad: '😢', surprised: '😲' }

const SongList = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState('all')
  const { setSong, emotion } = useSong()

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true)
        const data = await getAllSongs(selectedMood === 'all' ? '' : selectedMood)
        setSongs(data.songs)
      } catch (error) {
        console.error('Error fetching songs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [selectedMood])

  // Song click pe directly play karo
  const handleSongClick = (song) => {
    setSong(song)
  }

  return (
    <div className="flex flex-col h-full">

      {/* Title */}
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-medium">
        Songs
      </p>

      {/* Mood filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition capitalize
              ${selectedMood === mood
                ? 'bg-white/90 text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
          >
            {MOOD_EMOJI[mood]} {mood}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Songs list */}
      {!loading && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1"   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {songs.map((song) => (
            <div
              key={song._id}
              onClick={() => handleSongClick(song)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl px-3 py-2.5 cursor-pointer transition group"
            >
              <img
                src={song.posterUrl}
                alt={song.title}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate group-hover:text-white transition">
                  {song.title}
                </p>
                <span className="text-xs text-white/40 capitalize">
                  {MOOD_EMOJI[song.mood]} {song.mood}
                </span>
              </div>
              <span className="text-white/20 group-hover:text-white/60 transition text-lg">
                ▶
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default SongList