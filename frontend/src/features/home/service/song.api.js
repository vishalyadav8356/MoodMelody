import axios from "axios";

const api = axios.create({
    baseURL: "https://moodmelody-qqnx.onrender.com/",
    withCredentials: true
})    


export async function getMood({mood}){
    const response = await api.get("/api/songs?mood=" + mood)
    return response.data
}

export async function toggleLikedSong(songData) {
  const response = await api.post("/api/songs/like", songData)
  return response.data
}

export async function checkLikedSong(songId) {
  const response = await api.get("/api/songs/liked/check", {
    params: { songId}
  })
  return response.data
}

export async function getLikedSongs(emotion = ''){
  const response = await api.get("/api/songs/liked", {
    params: emotion ? { emotion } : {}
  })
  return response.data
}

export async function createMoodLog(logData){
  const response = await api.post("/api/moodlogs", logData)
  return response.data
}

export async function getMoodLogs(emotion = ''){
  const response = await api.get("/api/moodlogs", {
    params: emotion ? { emotion } : {}
  })
  return response.data
}

export async function getMoodStats() {
    const response = await api.get("/api/moodlogs/stats")
    return response.data
}

export async function getAllSongs(mood = '') {
    const response = await api.get("/api/songs/all", {
        params: mood ? { mood } : {}
    });
    return response.data;
}