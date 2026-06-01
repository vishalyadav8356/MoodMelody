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
    if (!song || !emotion) return;
    setIsLiked(prev => !prev); // optimistic UI

    try {
      const data = await toggleLikedSong({
        songId:    song._id,
        songTitle: song.title,
        songUrl:   song.url,
        posterUrl: song.posterUrl,
        emotion,
        confidence
      });
      console.log("Liked song data:", data);
      setIsLiked(data.liked); // server confirm
    } catch {
      setIsLiked(prev => !prev); // rollback
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
    if (!song?._id || !emotion) return;
    checkLikedSong(song._id, emotion)
      .then(data => setIsLiked(data.liked))
      .catch(() => setIsLiked(false));
  }, [song?._id, emotion]);


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