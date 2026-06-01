import { useState, useEffect } from "react"
import { getMoodLogs, getMoodStats } from "../service/song.api.js"

const MOODS = ['all','happy', 'sad', 'surprised']

export const useMoodLogs = () => {
  const [moodLogs, setMoodLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState('all')

  async function fetchStats() {
    try {
      const data = await getMoodStats()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    async function fetchMoodLogs() {
      try {
        setLoading(true)
        const data = await getMoodLogs(selectedMood === 'all' ? '' : selectedMood)
        setMoodLogs(data.logs || [])
      } catch {
        setMoodLogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchMoodLogs()
  }, [selectedMood])

  return { moodLogs, stats, loading, selectedMood, setSelectedMood, MOODS, refreshStats: fetchStats }
}