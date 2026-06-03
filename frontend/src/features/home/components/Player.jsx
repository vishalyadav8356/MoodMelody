import { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import { moodTheme } from '../../shared/utils/moodTheme'

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const Player = () => {
    const { song, isLiked, handleLike, emotion, playNext, queueIndex } = useSong()
    const theme = moodTheme[emotion] || moodTheme.default
    const accent = theme.accent


    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [showSpeed, setShowSpeed] = useState(false)
    const [speed, setSpeed] = useState(1)

    const isFirstLoad = useRef(true)  // ← top pe add karo

    useEffect(() => {
        if (!audioRef.current) return

        audioRef.current.load()
        setCurrentTime(0)
        setIsPlaying(false)

        if (isFirstLoad.current) {
            isFirstLoad.current = false
            return
        }

        audioRef.current.addEventListener(
            'loadeddata',
            () => {
                audioRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.error('Autoplay blocked:', err))
            },
            { once: true }
        )
    }, [song?.url])

    useEffect(() => {
        if (queueIndex >= 0 && audioRef.current) {
            audioRef.current.addEventListener('loadeddata', () => {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.error(err))
            }, { once: true })
        }
    }, [queueIndex])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) { audio.pause() } else { audio.play() }
        setIsPlaying(!isPlaying)
    }

    const skip = (secs) => {
        if (!audioRef.current) return
        audioRef.current.currentTime = Math.min(
            Math.max(audioRef.current.currentTime + secs, 0), duration
        )
    }

    const handleProgressClick = (e) => {
        const bar = progressRef.current
        const rect = bar.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        audioRef.current.currentTime = ratio * duration
        setCurrentTime(ratio * duration)
    }

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        audioRef.current.volume = val
        setIsMuted(val === 0)
    }

    const toggleMute = () => {
        if (isMuted) { audioRef.current.volume = volume || 0.5; setIsMuted(false) }
        else { audioRef.current.volume = 0; setIsMuted(true) }
    }

    const handleSpeedChange = (s) => {
        setSpeed(s)
        audioRef.current.playbackRate = s
        setShowSpeed(false)
    }

    const handleSongEnd = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        playNext()  // ← next song play karo
    }


    const progress = duration ? (currentTime / duration) * 100 : 0

    if (!song) return null

    return (
        <div className="w-full bg-black/60 backdrop-blur-md border-t border-white/10 px-4 py-2 text-white">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={handleSongEnd}
            />

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">

                {/* Left — Song info */}
                <div className="flex items-center gap-3 w-full md:w-64 shrink-0">
                    <img
                        src={song.posterUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                        <p className="text-xs font-medium truncate">{song.title}</p>
                        <span className="text-[11px] capitalize" style={{ color: accent }}>
                            {song.mood}
                        </span>
                    </div>
                    <button
                        onClick={handleLike}
                        className="text-base ml-auto shrink-0"
                    >
                        {isLiked ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Center — Controls + Progress */}
                <div className="flex flex-col flex-1 gap-2 w-full">

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-3 md:gap-4">

                        {/* Speed */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeed(!showSpeed)}
                                className="text-xs text-white/40 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/10"
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
                                            style={{ color: s === speed ? accent : 'rgba(255,255,255,0.6)' }}
                                        >
                                            {s}×
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* -5s */}
                        <button onClick={() => skip(-5)} className="text-white/50 hover:text-white transition text-lg">
                            ⏮
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold transition hover:scale-105 active:scale-95"
                            style={{ background: accent }}
                        >
                            {isPlaying ? '❚❚' : '▶'}
                        </button>

                        {/* +5s */}
                        <button className="text-white/50 hover:text-white transition text-sm">
                            ⏮
                        </button>

                        <button className="text-white/50 hover:text-white transition text-sm">
                            ⏭
                        </button>

                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30 w-8 text-right">{formatTime(currentTime)}</span>
                        <div
                            ref={progressRef}
                            onClick={handleProgressClick}
                            className="relative flex-1 h-[3px] bg-white/10 rounded-full"
                        >
                            <div
                                className="absolute top-0 left-0 h-1 rounded-full transition-all"
                                style={{ width: `${progress}%`, background: accent }}
                            />
                            <div
                               className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                style={{ left: `${progress}%`, background: accent }}
                            />
                        </div>
                        <span className="text-xs text-white/30 w-8">{formatTime(duration)}</span>
                    </div>

                </div>

                {/* Right — Volume */}
                <div className="hidden md:flex items-center gap-2 w-36 shrink-0 justify-end">
                    <button onClick={toggleMute} className="text-white/40 hover:text-white transition text-sm">
                        {isMuted || volume === 0 ? '🔇' : '🔊'}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        className="w-24"
                        style={{ accentColor: accent }}
                    />
                </div>

            </div>
        </div>
    )
}

export default Player