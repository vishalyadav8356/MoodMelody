import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const Protected = ({ children }) => {
    const { user, loading } = useAuth()
    console.log("Protected:", { user, loading })

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}


export default Protected