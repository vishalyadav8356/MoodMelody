import React, { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'

    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')

    return `${m}:${s}`
}

const Player = () => {

    const { song, isLiked, handleLike } = useSong()

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

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }

        setIsPlaying(!isPlaying)
    }

    const skip = (secs) => {
        const audio = audioRef.current

        if (!audio) return

        audio.currentTime = Math.min(
            Math.max(audio.currentTime + secs, 0),
            duration
        )
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration)
    }

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

        if (isMuted) {
            audio.volume = volume || 0.5
            setIsMuted(false)
        } else {
            audio.volume = 0
            setIsMuted(true)
        }
    }

    const handleSongEnd = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const progress = duration
        ? (currentTime / duration) * 100
        : 0

    if (!song) return null

    return (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 px-6 py-4 text-white shadow-2xl">

            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            <div className="flex flex-col gap-4">

                {/* Song Info */}
                <div className="flex items-center gap-4">

                    <img
                        src={song.posterUrl}
                        alt={song.title}
                        className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex flex-col flex-1">
                        <p className="font-semibold text-lg">
                            {song.title}
                        </p>

                        <span className="text-sm text-zinc-400 capitalize">
                            {song.mood}
                        </span>
                    </div>

                    <button
                        onClick={handleLike}
                        className="text-2xl transition-transform active:scale-90 hover:scale-110"
                        title={isLiked ? 'Unlike' : 'Like'}
                    >
                        {isLiked ? '❤️' : '🤍'}
                    </button>

                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">

                    <span className="text-sm text-zinc-400 w-12">
                        {formatTime(currentTime)}
                    </span>

                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="relative flex-1 h-2 bg-zinc-700 rounded-full cursor-pointer"
                    >

                        <div
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />

                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"
                            style={{ left: `${progress}%` }}
                        />

                    </div>

                    <span className="text-sm text-zinc-400 w-12">
                        {formatTime(duration)}
                    </span>

                </div>

                {/* Controls */}
                <div className="flex items-center justify-between flex-wrap gap-4">

                    {/* Left */}
                    <div className="flex items-center gap-4">

                        {/* Speed */}
                        <div className="relative">

                            <button
                                onClick={() => setShowSpeed(!showSpeed)}
                                className="px-3 py-1 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                            >
                                {speed}×
                            </button>

                            {
                                showSpeed && (
                                    <div className="absolute bottom-12 left-0 bg-zinc-800 rounded-lg shadow-lg overflow-hidden">

                                        {
                                            SPEED_OPTIONS.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSpeedChange(s)}
                                                    className={`block w-full px-4 py-2 text-left hover:bg-zinc-700 ${s === speed
                                                            ? 'bg-zinc-700'
                                                            : ''
                                                        }`}
                                                >
                                                    {s}×
                                                </button>
                                            ))
                                        }

                                    </div>
                                )
                            }

                        </div>

                        {/* Backward */}
                        <button
                            onClick={() => skip(-5)}
                            className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                        >
                            -5s
                        </button>

                        {/* Play Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-black text-xl font-bold transition"
                        >
                            {isPlaying ? '❚❚' : '▶'}
                        </button>

                        {/* Forward */}
                        <button
                            onClick={() => skip(5)}
                            className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
                        >
                            +5s
                        </button>

                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3">

                        <button
                            onClick={toggleMute}
                            className="px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
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
                            className="w-32 accent-green-500"
                        />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Player