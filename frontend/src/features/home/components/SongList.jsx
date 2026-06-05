import React, { useState, useEffect } from 'react'
import { getAllSongs } from '../service/song.api'
import { useSong } from '../hooks/useSong'

const MOODS = ['all', 'happy', 'sad', 'surprised',]
const MOOD_EMOJI = { all: '🎵', happy: '😊', sad: '😢', surprised: '😲', }

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
    <div className="flex flex-col h-full ">

      <p className="text-xs md:text-sm text-white/40 uppercase tracking-widest mb-3 font-medium">
        Recommended for You
      </p>

      {/* Mood filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap shrink-0">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition capitalize
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
      {!loading && songs.length === 0 && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-4xl mb-3">🎵</div>
          <p className="text-white/50 text-sm">
            No songs found for this mood
          </p>
        </div>
      )}

      {/* Songs list */}
      {!loading && (
        <div
          className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 min-h-0"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) rgba(0,0,0,0.1)',
            WebkitScrollbar: '8px'
          }}
        >
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?._id === song._id

            return (
              <div
                key={song._id}
                onClick={() => handleSongClick(song, index)}
                className={`flex items-center gap-3 border rounded-xl px-3 py-3 md:px-4 cursor-pointer transition-all duration-200 group
                   ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/30'
                  }`}
              >
                <img
                  src={song.posterUrl}
                  alt={song.title}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <p className={`text-sm md:text-base font-medium truncate ${isCurrentSong ? 'text-white' : 'text-white/80'}`}>
                    {song.title}
                  </p>
                  <span className="text-xs md:text-sm text-white/40 capitalize">
                    {MOOD_EMOJI[song.mood]} {song.mood}
                  </span>
                </div>

                {/* Playing indicator */}

                {isCurrentSong ? (
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <div
                      className="w-0.5 h-3 rounded-full animate-bounce"
                      style={{ background: 'white', animationDelay: '0ms' }}
                    />
                    <div
                      className="w-0.5 h-4 rounded-full animate-bounce"
                      style={{ background: 'white', animationDelay: '150ms' }}
                    />
                    <div
                      className="w-0.5 h-2 rounded-full animate-bounce"
                      style={{ background: 'white', animationDelay: '300ms' }}
                    />
                  </div>
                ) : (
                  <span className="text-white/20 group-hover:text-white/60 transition text-lg flex-shrink-0">
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