import { useState } from 'react'
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

  const theme = moodTheme[emotion] || moodTheme.default
  const accent = theme.accent

  const [activeTab, setActiveTab] = useState('today')

  // Timeline data format
  const timelineData = () => {
    if (!stats?.timeline) return []
    const map = {}
    stats.timeline.forEach(({ _id, count }) => {
      if (!map[_id.date]) map[_id.date] = { date: _id.date }
      map[_id.date][_id.emotion] = count
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
            {stats && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col gap-3 flex-1 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Mood History</p>
                    <p className="text-sm font-medium text-white mt-0.5">Today&apos;s Timeline</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                    <span className="text-xs text-white/50">LIVE</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setActiveTab('today')}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg transition"
                    style={activeTab === 'today'
                      ? { background: accent, color: 'black' }
                      : { color: 'rgba(255,255,255,0.4)' }
                    }
                  >
                    TODAY
                  </button>
                  <button
                    onClick={() => setActiveTab('7days')}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg transition"
                    style={activeTab === '7days'
                      ? { background: accent, color: 'black' }
                      : { color: 'rgba(255,255,255,0.4)' }
                    }
                  >
                    7 DAYS
                  </button>
                </div>

                {/* TODAY — scrollable list */}
                {activeTab === 'today' && (
                  <div
                    className="flex flex-col gap-2 overflow-y-auto flex-1"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {stats?.recentLogs?.length > 0 ? (
                      stats.recentLogs.map((log) => (
                        <div key={log._id} className="flex items-center gap-3 py-1">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
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
                )}

                {/* 7 DAYS — bar chart */}
                {activeTab === '7days' && (
  <div className="flex-1">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={timelineData()} barSize={14}>
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.8)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '11px'
          }}
          formatter={(value, name) => [value, `${MOOD_EMOJI[name]} ${name}`]}
        />
        <Bar dataKey="happy" fill="#f59e0b" radius={[4,4,0,0]} />
        <Bar dataKey="sad" fill="#6366f1" radius={[4,4,0,0]} />
        <Bar dataKey="surprised" fill="#ec4899" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="flex gap-3 justify-center mt-1">
      {[['happy','#f59e0b'],['sad','#6366f1'],['surprised','#ec4899']].map(([mood, color]) => (
        <div key={mood} className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-xs text-white/40 capitalize">{MOOD_EMOJI[mood]} {mood}</span>
        </div>
      ))}
    </div>
  </div>
)}

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