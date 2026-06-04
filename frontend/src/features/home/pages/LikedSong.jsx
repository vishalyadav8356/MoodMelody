import { useLikedSongs } from '../hooks/useLikedSongs'
import { useNavigate } from 'react-router-dom'

const MOOD_EMOJI = {
  all: '🎵',
  happy: '😊',
  sad: '😢',
  surprised: '😲',
  neutral: '😐'
}

const LikedSongs = () => {
  const { likedSongs, loading, selectedMood, setSelectedMood, MOODS } = useLikedSongs()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-white px-3 md:px-6 py-4 md:py-8 max-w-6xl mx-auto flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition text-sm"
        >
          ←
        </button>
        <h1 className="text-xl md:text-2xl font-bold"> Liked Songs</h1>
      </div>

      {/* Mood Filter Chips */}
      <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium
              ${selectedMood === mood
                ? 'bg-green-500 text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
          >
            {MOOD_EMOJI[mood]} {mood}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && likedSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
          <span className="text-4xl md:text-5xl">🤍</span>
          <p className="text-base md:text-lg text-center px-4">
            {selectedMood === 'all'
              ? 'Koi liked song nahi hai abhi'
              : `${selectedMood} mood mein koi liked song nahi`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-500 text-black rounded-lg text-sm font-medium hover:bg-green-400 transition"
          >
            Songs sunne jao
          </button>
        </div>
      )}

      {/* Songs List */}
      {!loading && likedSongs.length > 0 && (
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 md:pr-2 mb-4">

          {/* Total count */}
          <p className="text-sm text-zinc-500 mb-2">
            {likedSongs.length} song{likedSongs.length > 1 ? 's' : ''}
          </p>

          {likedSongs.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3 md:px-4 py-3 hover:bg-white/10 transition"      >
              {/* Poster */}
              <img
                src={item.posterUrl}
                alt={item.songTitle}
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover"
              />

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium truncate">{item.songTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="hidden sm:block text-xs text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Heart */}
              <span className="text-xl flex-shrink-0">❤️</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default LikedSongs