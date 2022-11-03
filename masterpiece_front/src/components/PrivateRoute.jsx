import { useLocation, Navigate } from 'react-router-dom'
import { tokenExpired } from '../helpers/helper.js'

// Component to restrict access to user not logged
export const PrivateRoute = ({ children }) => {
    const location = useLocation()

    const token = localStorage.getItem('token')
    const expired = tokenExpired(token)
    if (!token || expired) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace/>
    }

    // authorized so return child components
    return children;
}