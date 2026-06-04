import { getMood, toggleLikedSong ,checkLikedSong, createMoodLog } from "../service/song.api.js";
import { useContext, useEffect } from "react";
import { SongContext } from "../song.context.jsx";

export const useSong = () => {
  const { song, setSong, loading, setLoading, isLiked, setIsLiked, emotion, setEmotion , confidence, setConfidence,   queue, setQueue, queueIndex, setQueueIndex } = useContext(SongContext);

  async function handleGetSong({ mood }) {
    try {
      setLoading(true);
      const data = await getMood({ mood });
      const fetchedSong = data.songs?.[0];
      
      if (!fetchedSong) {
        console.error("No songs found for mood:", mood);
        setLoading(false);
        return;
      }
      
      setSong(fetchedSong);
      setEmotion(mood);

         if (mood !== emotion) {
        await createMoodLog({ 
          emotion: mood, 
          confidence: confidence || 0,
          songTitle: fetchedSong.title,
          posterUrl: fetchedSong.posterUrl
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setLoading(false);
    }
  }

   // Heart button handler
async function handleLike() {
  if (!song?._id) return;

  const prevLiked = isLiked;
  const nextLiked = !prevLiked;

  setIsLiked(nextLiked);
  setSong(prev => prev ? { ...prev, isLiked: nextLiked } : prev);

  try {
    const data = await toggleLikedSong({
      songId: song._id,
      songTitle: song.title,
      songUrl: song.url,
      posterUrl: song.posterUrl,
      emotion: emotion || 'neutral',
      confidence: confidence || 0
    });

    console.log('Liked song data:', data);

    const finalLiked =
      typeof data?.liked === 'boolean'
        ? data.liked
        : typeof data?.isLiked === 'boolean'
        ? data.isLiked
        : nextLiked;

    setIsLiked(finalLiked);
    setSong(prev => prev ? { ...prev, isLiked: finalLiked } : prev);
  } catch (error) {
    console.error('Like error:', error);
    setIsLiked(prevLiked);
    setSong(prev => prev ? { ...prev, isLiked: prevLiked } : prev);
  }
}

  async function playSong(song, index) {
     setQueue(song)
     setQueueIndex(index)
     setSong(song[index])
  }

  async function playNext() {
  if (queueIndex < queue.length - 1) {
    const nextIndex = queueIndex + 1
    setQueueIndex(nextIndex)
    setSong(queue[nextIndex])
  } else {
    setQueueIndex(-1)
  }
}

 useEffect(() => {
  if (!song?._id) return

  async function fetchStatus() {
    const data = await checkLikedSong(song._id)
    setIsLiked(data.liked)
  }

  fetchStatus()
}, [song?._id])


  return {
    song,
    setSong,
    loading,
    handleGetSong,
    handleLike,
    isLiked,
    setIsLiked,
    emotion,
    setEmotion,
    confidence,
    setConfidence,
    playSong,
    playNext,
    queue, 
    queueIndex
  }
}