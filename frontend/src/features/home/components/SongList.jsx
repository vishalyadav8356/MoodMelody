import React, { useState, useEffect } from 'react'
import { getAllSongs } from '../service/song.api'
import { useSong } from '../hooks/useSong'

const MOODS = ['all', 'happy', 'sad', 'surprised']
const MOOD_EMOJI = { all: '🎵', happy: '😊', sad: '😢', surprised: '😲' }

const SongList = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState('all')
  const { song: currentSong, emotion, playSong } = useSong()

  useEffect(() => {
    if (emotion && emotion !== 'neutral') {
      setSelectedMood(emotion)
    }
  }, [emotion])

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

  const handleSongClick = (song, index) => {
    playSong(songs, index)
  }

  return (
    <div className="flex flex-col h-full">

      {/* Title */}
      <p className="text-xs sm:text-sm text-white/40 uppercase tracking-widest mb-2 sm:mb-3 font-medium shrink-0">
        Recommended for You
      </p>

      {/* Mood filter chips */}
      <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap shrink-0">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full font-medium transition capitalize
              text-xs sm:text-sm
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
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎵</div>
          <p className="text-white/50 text-xs sm:text-sm">
            No songs found for this mood
          </p>
        </div>
      )}

      {/* Songs list */}
      {!loading && songs.length > 0 && (
        <div
          className="flex flex-col gap-1.5 sm:gap-2 overflow-y-auto flex-1 min-h-0 pr-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?._id === song._id

            return (
              <div
                key={song._id}
                onClick={() => handleSongClick(song, index)}
                className={`flex items-center gap-2 sm:gap-3 border rounded-xl cursor-pointer transition-all duration-200 group
                  px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3
                  ${isCurrentSong
                    ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/30'
                  }`}
              >
                <img
                  src={song.posterUrl}
                  alt={song.title}
                  className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <p className={`font-medium truncate
                    text-xs sm:text-sm md:text-base
                    ${isCurrentSong ? 'text-white' : 'text-white/80'}`}
                  >
                    {song.title}
                  </p>
                  <span className="text-xs text-white/40 capitalize mt-0.5">
                    {MOOD_EMOJI[song.mood]} {song.mood}
                  </span>
                </div>

                {/* Playing indicator */}
                {isCurrentSong ? (
                  <div className="flex items-end gap-0.5 flex-shrink-0 h-4">
                    <div className="w-0.5 h-3 rounded-full animate-bounce bg-white" style={{ animationDelay: '0ms' }} />
                    <div className="w-0.5 h-4 rounded-full animate-bounce bg-white" style={{ animationDelay: '150ms' }} />
                    <div className="w-0.5 h-2 rounded-full animate-bounce bg-white" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <span className="text-white/20 group-hover:text-white/60 transition text-base sm:text-lg flex-shrink-0">
                    ▶
                  </span>
                )}

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default SongList