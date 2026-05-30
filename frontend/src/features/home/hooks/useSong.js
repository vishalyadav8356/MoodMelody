import { getMood, toggleLikedSong ,checkLikedSong, createMoodLog } from "../service/song.api.js";
import { useContext, useEffect } from "react";
import { SongContext } from "../song.context.jsx";

export const useSong = () => {
  const { song, setSong, loading, setLoading, isLiked, setIsLiked, emotion, setEmotion } = useContext(SongContext);

  async function handleGetSong({ mood }) {
    try {
      setLoading(true);
      const data = await getMood({ mood });
      const fetchedSong = data.songs[0];
      setSong(fetchedSong);
      setEmotion(mood);

      await createMoodLog({ 
        emotion: mood, 
        confidence: 0.87,
        songTitle: fetchedSong.title,
        posterUrl: fetchedSong.posterUrl
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setLoading(false);
    }
  }

    useEffect(() => {
    if (!song?._id || !emotion) return;
    checkLikedSong(song._id, emotion)
      .then(data => setIsLiked(data.liked))
      .catch(() => setIsLiked(false));
  }, [song?._id, emotion]);

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
        confidence: 0.87
      });
      console.log("Liked song data:", data);
      setIsLiked(data.liked); // server confirm
    } catch {
      setIsLiked(prev => !prev); // rollback
    }
  }


  return {
    song,
    loading,
    handleGetSong,
    handleLike,
    isLiked,
    setIsLiked,
    emotion,
    setEmotion
  };
};
