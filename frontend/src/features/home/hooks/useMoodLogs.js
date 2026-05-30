import { useState, useEffect } from "react"
import { getMoodLogs, getMoodStats } from "../service/song.api.js"

const MOODS = ['all','happy', 'sad', 'surprised']

export const useMoodLogs = () => {
  const [moodLogs, setMoodLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState('all')

  // Stats ek baar fetch karo — filter se affect nahi hoga
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getMoodStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  // Logs — filter ke saath
  useEffect(() => {
    async function fetchMoodLogs() {
      try {
        setLoading(true)
        const data = await getMoodLogs(selectedMood === 'all' ? '' : selectedMood)
        setMoodLogs(data.log)
      } catch (error) {
        setMoodLogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchMoodLogs()
  }, [selectedMood])

  return { moodLogs, stats, loading, selectedMood, setSelectedMood, MOODS }
}