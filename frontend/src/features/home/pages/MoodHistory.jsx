import React from 'react'
import { useMoodLogs } from '../hooks/useMoodLogs'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts'

const MOOD_EMOJI = {
  all: '🎵',
  happy: '😊',
  sad: '😢',
  surprised: '😲'
}

const MOOD_COLORS = {
  happy: '#f59e0b',
  sad: '#6366f1',
  surprised: '#ec4899'
}

const MoodHistory = () => {
  const { moodLogs, stats, loading, selectedMood, setSelectedMood, MOODS } = useMoodLogs()
  const navigate = useNavigate()

  // Timeline data recharts ke liye format karo
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
    <div className="min-h-screen text-white px-6 py-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">🕐 Mood History</h1>
      </div>

      {/* Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/60 mb-4 font-medium">Overall mood distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.distribution}
                  dataKey="count"
                  nameKey="emotion"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                >
                  {stats.distribution.map((entry) => (
                    <Cell
                      key={entry.emotion}
                      fill={MOOD_COLORS[entry.emotion]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [value, `${MOOD_EMOJI[name]} ${name}`]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-2">
              {stats.distribution.map((entry) => (
                <div key={entry.emotion} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: MOOD_COLORS[entry.emotion] }}
                  />
                  <span className="text-xs text-white/60 capitalize">
                    {MOOD_EMOJI[entry.emotion]} {entry.emotion} ({entry.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <p className="text-sm text-white/60 mb-4 font-medium">Last 7 days timeline</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timelineData()} barSize={16}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [value, `${MOOD_EMOJI[name]} ${name}`]}
                />
                <Bar dataKey="happy" fill={MOOD_COLORS.happy} radius={[4, 4, 0, 0]} />
                <Bar dataKey="sad" fill={MOOD_COLORS.sad} radius={[4, 4, 0, 0]} />
                <Bar dataKey="surprised" fill={MOOD_COLORS.surprised} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* Mood Filter Chips */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize
              ${selectedMood === mood
                ? 'bg-white/90 text-black'
                : 'bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20'
              }`}
          >
            {MOOD_EMOJI[mood]} {mood}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && moodLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/40">
          <span className="text-5xl">🕐</span>
          <p className="text-lg">
            {selectedMood === 'all'
              ? 'Koi mood history nahi hai abhi'
              : `${selectedMood} mood ki koi history nahi`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white/90 text-black rounded-lg text-sm font-medium hover:bg-white transition"
          >
            Songs sunne jao
          </button>
        </div>
      )}

      {/* Logs List */}
      {!loading && moodLogs.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/40 mb-2">
            {moodLogs.length} session{moodLogs.length > 1 ? 's' : ''}
          </p>

          {moodLogs.map((log) => (
            <div
              key={log._id}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/15 transition"
            >
              <img
                src={log.posterUrl}
                alt={log.songTitle}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium truncate">{log.songTitle}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full capitalize text-white/60">
                    {MOOD_EMOJI[log.emotion]} {log.emotion}
                  </span>
                  {log.confidence && (
                    <span className="text-xs text-white/40">
                      {Math.round(log.confidence * 100)}% confidence
                    </span>
                  )}
                  <span className="text-xs text-white/40 ml-auto">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default MoodHistory