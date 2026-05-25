import React, {useState} from 'react'
import '../../shared/styles/button.css'
import FromGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()

    const {loading , handleLogin} = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e){
        e.preventDefault()
        await handleLogin({email, password})
        navigate('/')
    }

    return (
        <main className='flex items-center justify-center min-h-screen'>
            <div className='min-w-[300px] '>
                <h1 className='text-2xl font-bold text-white mb-4'>Login</h1>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <FromGroup 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label='Email' placeholder='Enter your email' />

                    <FromGroup 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label='Password' placeholder='Enter your password' />

                    <button className='button' type='submit'>Login</button>
                </form>
                 <p className='text-sm text-white mt-2'>
                    Don't have an account? <Link to="/register" className='text-[#dd4200]'>Create Account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login