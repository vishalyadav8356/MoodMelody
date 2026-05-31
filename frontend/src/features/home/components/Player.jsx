import React, { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import { moodTheme } from '../../shared/utils/moodTheme'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const Player = () => {
    const { song, isLiked, handleLike, emotion } = useSong()

    const theme = moodTheme[emotion] || moodTheme.default
    const accent = theme.accent

    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [volume, setVolume] = useState(1)
    const [showSpeed, setShowSpeed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load()
            setIsPlaying(false)
            setCurrentTime(0)
        }
    }, [song?.url])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) { audio.pause() } else { audio.play() }
        setIsPlaying(!isPlaying)
    }

    const skip = (secs) => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), duration)
    }

    const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime)
    const handleLoadedMetadata = () => setDuration(audioRef.current.duration)

    const handleProgressClick = (e) => {
        const bar = progressRef.current
        const rect = bar.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        const newTime = ratio * duration
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleSpeedChange = (s) => {
        setSpeed(s)
        audioRef.current.playbackRate = s
        setShowSpeed(false)
    }

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        audioRef.current.volume = val
        setIsMuted(val === 0)
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (isMuted) { audio.volume = volume || 0.5; setIsMuted(false) }
        else { audio.volume = 0; setIsMuted(true) }
    }

    const handleSongEnd = () => { setIsPlaying(false); setCurrentTime(0) }

    const progress = duration ? (currentTime / duration) * 100 : 0

    if (!song) return null

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-t border-white/10 px-4 md:px-6 py-3 text-white"
            style={{ borderTopColor: `${accent}30` }}
        >
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            <div className="flex flex-col gap-2">

                {/* Song Info */}
                <div className="flex items-center gap-3">
                    <img
                        src={song.posterUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{song.title}</p>
                        <span className="text-xs capitalize" style={{ color: accent }}>
                            {song.mood}
                        </span>
                    </div>
                    <button
                        onClick={handleLike}
                        className="text-xl transition-transform active:scale-90 hover:scale-110 flex-shrink-0"
                    >
                        {isLiked ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 w-10 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer"
                    >
                        <div
                            className="absolute top-0 left-0 h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%`, background: accent }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                            style={{ left: `${progress}%`, background: accent }}
                        />
                    </div>
                    <span className="text-xs text-white/40 w-10">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        {/* Speed */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeed(!showSpeed)}
                                className="px-2 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition"
                            >
                                {speed}×
                            </button>
                            {showSpeed && (
                                <div className="absolute bottom-10 left-0 bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden z-50">
                                    {SPEED_OPTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSpeedChange(s)}
                                            className="block w-full px-4 py-1.5 text-xs text-left hover:bg-white/10 transition"
                                            style={{ color: s === speed ? accent : 'rgba(255,255,255,0.7)' }}
                                        >
                                            {s}×
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => skip(-5)}
                            className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition"
                        >
                            -5s
                        </button>

                        {/* Play button — accent color */}
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold transition active:scale-95 hover:opacity-90"
                            style={{ background: accent }}
                        >
                            {isPlaying ? '❚❚' : '▶'}
                        </button>

                        <button
                            onClick={() => skip(5)}
                            className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition"
                        >
                            +5s
                        </button>

                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="text-sm px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition"
                        >
                            {isMuted || volume === 0 ? '🔇' : '🔊'}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolume}
                            className="w-20 md:w-28"
                            style={{ accentColor: accent }}
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Player