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

            await handleLogin({
                email,
                password
            })

            navigate('/')
        } catch (error) {
            console.error(error)
            setErrors({
                submit: 'Invalid email or password'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-green-950">
            <div className="container mx-auto h-full flex flex-col lg:flex-row">

                {/* Left Section */}
                <div className="flex flex-col justify-center px-6 py-5 lg:px-16 ">

                    <div className="max-w-xl">
                        <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-3xl">
                            🎵
                        </div>

                        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                            Mood <span className="text-green-400">Melody</span>
                        </h1>

                        <p className="mt-4 text-zinc-300 text-base md:text-lg leading-relaxed">
                            Detect your facial expression and instantly discover
                            songs that perfectly match your mood.
                        </p>

                        <div className="flex gap-4 mt-4 text-4xl">
                            <span>😊</span>
                            <span>😢</span>
                            <span>😲</span>
                        </div>

                
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(34,197,94,0.15)]">

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white">
                                Welcome Back
                            </h2>

                            <p className="text-zinc-400 mt-2">
                                Login to continue your music journey
                            </p>
                        </div>

                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <FormGroup
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors(prev => ({
                                            ...prev,
                                            email: ''
                                        }))
                                    }}
                                    label="Email"
                                    placeholder="Enter your email"
                                />

                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <FormGroup
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors(prev => ({
                                            ...prev,
                                            password: ''
                                        }))
                                    }}
                                    label="Password"
                                    placeholder="Enter your password"
                                />

                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {errors.submit && (
                                <p className="text-red-400 text-sm text-center">
                                    {errors.submit}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <p className="text-sm text-zinc-400 mt-6 text-center">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-green-400 hover:text-green-300"
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

