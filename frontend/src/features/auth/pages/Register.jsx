import React from 'react'
import '../../shared/styles/button.css'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

    const {loading , handleRegister} = useAuth()

    async function handleSubmit(e){
        e.preventDefault()

        await handleRegister({username: name, email, password})
        navigate('/')
    }

  return (
     <main className='flex items-center justify-center min-h-screen'>
            <div className='min-w-[300px] '>
                <h1 className='text-2xl font-bold text-white mb-4'>Register</h1>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <FormGroup
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                     label='Name' placeholder='Enter your name' />
                    <FormGroup 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label='Email' placeholder='Enter your email' />
                    <FormGroup 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label='Password' placeholder='Enter your password' />
                    <button className='button' type='submit'>Register</button>
                </form>
                 <p className='text-sm text-white mt-2'>Already have an account? <Link to="/login" className="text-[#dd4200]">Login to Account</Link></p>
            </div>
        </main>
  )
}

export default Register