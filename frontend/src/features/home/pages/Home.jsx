import React from 'react'
import FaceExpression from '../../Expression/pages/FaceExpression'
import Player from '../components/Player'
import SongList from '../components/SongList'
import { useSong } from '../hooks/useSong'
import { useMoodLogs } from '../hooks/useMoodLogs'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { moodTheme } from '../../shared/utils/moodTheme'

const MOOD_EMOJI = { happy: '😊', sad: '😢', surprised: '😲' }

const Home = () => {
  const { handleGetSong, setEmotion, setConfidence, emotion } = useSong()
  const { stats } = useMoodLogs()
  console.log('stats:', stats) 

  const theme = moodTheme[emotion] || moodTheme.default
  const accent = theme.accent

  // Timeline data format
  const timelineData = () => {
    if (!stats?.timeline) return []
    const map = {}
    stats.timeline.forEach(({ _id, count }) => {
      if (!map[_id.date]) map[_id.date] = { date: _id.date, count: 0 }
      map[_id.date].count += count
    })
    return Object.values(map)
  }

return (
    <div className="flex flex-col overflow-hidden text-white"
      style={{ height: 'calc(100vh - 56px)' }}  >

      {/* Main */}
      <div className="flex-1 overflow-hidden p-3 md:p-4">
        <div className="h-full flex gap-4">

          {/* Left — Camera + Insights */}
          <div className="flex flex-col gap-3 w-5/12 shrink-0 overflow-hidden">

            {/* Camera card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shrink-0">
              <FaceExpression onClick={(expression, detectedConfidence) => {
                handleGetSong({ mood: expression })
                setEmotion(expression)
                setConfidence(detectedConfidence)
              }} />
            </div>

            {/* Mood Insights card */}
          {/* Mood Insights card */}

{stats && (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
    
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Mood History</p>
        <p className="text-sm font-medium text-white mt-0.5">Today's Timeline</p>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" 
          style={{ background: accent }}
        />
        <span className="text-xs text-white/50">LIVE</span>
      </div>
    </div>

    {/* TODAY / 7 DAYS tabs */}
    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
      <button
        className="flex-1 py-1.5 text-xs font-medium rounded-lg transition"
        style={{ background: accent, color: 'black' }}
      >
        TODAY
      </button>
      <button
        className="flex-1 py-1.5 text-xs font-medium rounded-lg text-white/40 hover:text-white/70 transition"
      >
        7 DAYS
      </button>
    </div>

    {/* Timeline list */}
    <div className="flex flex-col gap-2 overflow-y-auto max-h-36"
      style={{ scrollbarWidth: 'none' }}
    >
      {stats?.recentLogs?.length > 0 ? (
        stats.recentLogs.map((log) => (
          <div key={log._id} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
            <span className="text-sm font-medium capitalize" style={{ color: accent }}>
              {log.emotion}
            </span>
            <span className="text-xs text-white/30 ml-auto">
              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))
      ) : (
        <p className="text-xs text-white/30 text-center py-4">No logs today</p>
      )}
    </div>

  </div>
)}

          </div>

          {/* Right — Songs full height */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col flex-1 overflow-hidden">
            <SongList />
          </div>

        </div>
      </div>

      <Player />
    </div>
  )
}

export default Home