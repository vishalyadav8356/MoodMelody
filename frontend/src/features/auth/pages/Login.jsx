import { useState } from 'react'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }
        if (!password.trim()) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return
        try {
            setIsSubmitting(true)
            await handleLogin({ email, password })
            navigate('/')
        } catch (error) {
            console.error(error)
            setErrors({ submit: 'Invalid email or password' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-green-950">
            <div className="min-h-screen flex flex-col lg:flex-row">

                {/* Left Section */}
                <div className="
                    flex flex-col justify-center
                    px-6 py-8
                    sm:px-10 sm:py-10
                    md:px-14 md:py-5
                    lg:w-1/2 lg:px-16 lg:py-0
                ">
                    <div className="max-w-lg mx-auto lg:mx-0">

                        {/* Icon */}
                        <div className="
                            w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center
                            sm:w-12 sm:h-12 sm:rounded-2xl sm:text-2xl
                            lg:w-16 lg:h-16 lg:text-3xl
                            text-xl
                        ">
                            🎵
                        </div>

                        {/* Title */}
                        <h1 className="
                            mt-3 font-bold text-white
                            text-3xl
                            sm:text-4xl sm:mt-4
                            md:text-5xl
                            lg:text-6xl
                        ">
                            Mood <span className="text-green-400">Melody</span>
                        </h1>

                        {/* Description */}
                        <p className="
                            mt-2 text-zinc-300 leading-relaxed
                            text-sm
                            sm:text-base sm:mt-3
                            md:text-lg md:mt-4
                        ">
                            Detect your facial expression and instantly discover
                            songs that perfectly match your mood.
                        </p>

                        {/* Emojis */}
                        <div className="
                            flex gap-3 mt-3
                            text-2xl
                            sm:text-3xl sm:mt-4
                            md:text-4xl
                        ">
                            <span>😊</span>
                            <span>😢</span>
                            <span>😲</span>
                        </div>

                    </div>
                </div>

                {/* Right Section — Form */}
                <div className="
                    flex-1 flex items-center justify-center
                    px-6 pb-10
                    sm:px-10 sm:pb-12
                    md:px-10
                    lg:w-1/2 lg:py-0 lg:px-16
                ">
                    <div className="
                        w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.15)]
                        p-6
                        sm:p-7 sm:rounded-3xl
                        md:p-8
                        max-w-sm sm:max-w-md
                    ">

                        {/* Header */}
                        <div className="text-center mb-5 sm:mb-6 md:mb-2">
                            <h2 className="
                                font-bold text-white
                                text-2xl
                                sm:text-3xl
                            ">
                                Welcome Back
                            </h2>
                            <p className="
                                text-zinc-400 mt-1
                                text-xs
                                sm:text-sm
                            ">
                                Login to continue your music journey
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>

                            <div>
                                <FormGroup
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors(prev => ({ ...prev, email: '' }))
                                    }}
                                    label="Email"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <FormGroup
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors(prev => ({ ...prev, password: '' }))
                                    }}
                                    label="Password"
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {errors.submit && (
                                <p className="text-red-400 text-xs sm:text-sm text-center">{errors.submit}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    w-full bg-green-500 hover:bg-green-600
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    text-black font-bold rounded-xl
                                    transition-all duration-300
                                    hover:scale-[1.02] active:scale-95
                                    py-2.5 text-sm mt-1
                                    sm:py-3 sm:text-base
                                "
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                        </form>

                        {/* Register link */}
                        <p className="text-zinc-400 text-center mt-4 sm:mt-5
                            text-xs sm:text-sm
                        ">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-green-400 hover:text-green-300 font-medium"
                            >
                                Create Account
                            </Link>
                        </p>

                    </div>
                </div>

            </div>
        </main>
    )
}

export default Login