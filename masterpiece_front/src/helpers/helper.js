import jwt_decode from 'jwt-decode'

// the function to logout when jwt expired
export const tokenExpired = (token) => {
    if(token){
        const tokenDecoded = jwt_decode(token)

        if(Date.now() > tokenDecoded.exp * 1000){
            localStorage.clear()
            return true
        }
        return false
    }
}