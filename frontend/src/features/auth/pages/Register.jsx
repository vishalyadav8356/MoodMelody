import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'
import { useState } from 'react'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const { handleRegister } = useAuth()

    async function handleSubmit(e){
        e.preventDefault()

        await handleRegister({username: name, email, password})
        navigate('/')
    }


return (
  <main className="h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-green-950">
    <div className="h-full flex flex-col lg:flex-row">

      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16">
        <div className="max-w-xl">
          <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-3xl mb-3">
            🎵
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Mood <span className="text-green-400">Melody</span>
          </h1>

          <p className="mt-4 text-zinc-300 text-base md:text-lg">
            Create an account and let AI detect your emotions to recommend the perfect songs for every mood.
          </p>

          <div className="flex gap-4 mt-3 text-4xl">
            <span>😊</span>
            <span>😢</span>
            <span>😲</span>
          </div>

      
        </div>
      </div>

      {/* Register Card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-8 lg:pb-0">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(34,197,94,0.15)]">

          <div className="text-center mb-3">
            <h2 className="text-3xl font-bold text-white">
              Create Account
            </h2>

            <p className="text-zinc-400 mt-2">
              Join Mood Melody today
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormGroup
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              placeholder="Enter your name"
            />

            <FormGroup
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="Enter your email"
            />

            <FormGroup
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-zinc-400 mt-2 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300"
            >
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