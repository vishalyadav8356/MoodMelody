import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }
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
      await handleRegister({ username: name, email, password })
      navigate('/')
    } catch (error) {
      setErrors({
        submit: error?.response?.data?.message || 'Registration failed. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-green-950 overflow-y-auto">
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* Left Side */}
        <div className="
          flex flex-col justify-center
          px-6 py-6
          sm:px-10 sm:py-8
          md:px-14 md:py-6
          lg:w-1/2 lg:px-16 lg:py-0
        ">
          <div className="max-w-lg mx-auto lg:mx-0">

            <div className="
              w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center
              sm:w-12 sm:h-12 sm:rounded-2xl sm:text-2xl
              lg:w-16 lg:h-16 lg:text-3xl
              text-xl
            ">
              🎵
            </div>

            <h1 className="
              mt-2 font-bold text-white
              text-2xl
              sm:text-3xl sm:mt-3
              md:text-4xl
              lg:text-6xl lg:mt-4
            ">
              Mood <span className="text-green-400">Melody</span>
            </h1>

            <p className="
              mt-2 text-zinc-300 leading-relaxed
              text-xs
              sm:text-sm sm:mt-2
              md:text-base
              lg:text-lg lg:mt-4
            ">
              Create an account and let AI detect your emotions to recommend
              the perfect songs for every mood.
            </p>

            <div className="
              flex gap-3 mt-2
              text-xl
              sm:text-2xl sm:mt-3
              md:text-3xl
              lg:text-4xl lg:mt-4
            ">
              <span>😊</span>
              <span>😢</span>
              <span>😲</span>
            </div>

          </div>
        </div>

        {/* Register Card */}
        <div className="
          flex-1 flex items-center justify-center
          px-6 py-6
          sm:px-10 sm:py-8
          md:px-14 md:py-1
          lg:w-1/2 lg:py-0 lg:px-16
        ">
          <div className="
            w-full bg-white/5 backdrop-blur-xl border border-white/10
            shadow-[0_0_50px_rgba(34,197,94,0.15)]
            p-5 rounded-2xl
            sm:p-6 sm:rounded-3xl
            md:p-2
            lg:p-8
            max-w-sm sm:max-w-md
          ">

            <div className="text-center mb-3 sm:mb-4 md:mb-1">
              <h2 className="font-bold text-white text-xl sm:text-2xl lg:text-3xl">
                Create Account
              </h2>
              <p className="text-zinc-400 mt-1 text-xs sm:text-sm">
                Join Mood Melody today
              </p>
            </div>

            <form className="flex flex-col gap-2 sm:gap-3 md:gap-2" onSubmit={handleSubmit}>

              <div>
                <FormGroup
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setErrors(prev => ({ ...prev, name: '' }))
                  }}
                  label="Name"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

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
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
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
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-400 text-xs text-center">{errors.submit}</p>
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
                  py-2 text-sm mt-1
                  sm:py-2.5
                  md:py-3 md:text-base
                "
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>

            </form>

            <p className="text-zinc-400 text-center mt-3 sm:mt-4 text-xs sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                Login
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
)
}

export default Register