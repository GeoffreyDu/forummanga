import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import '../../styles/LoggedNavbar.css'

// the navbar when logged
export const LoggedNavbar = ({ setUser, notifElements }) => {
    const navigate = useNavigate()
    
    const logout = () => {
        localStorage.clear()
        setUser({})
        notifElements.setMessage("Vous avez bien été déconnecté")
        notifElements.setSeverity("success")
        notifElements.setOpen(true)
        navigate('/login')
    }

    return (
        <nav id='loggedNavbar'>
            <NavLink id='userHome' className='itemsLogged' style={{ textDecoration: 'none' }} to='/home'>Accueil utilisateur</NavLink>
            <p id='titleLogged'>JapanForum</p>
            <div id='loggedNavbarMenu'>
                <NavLink id='themeList' className='itemsLogged' style={{ textDecoration: 'none' }} to='/themes'>Liste des thèmes</NavLink>
                <Button id='buttonLogout' onClick={logout}><LogoutIcon/></Button>
            </div>
        </nav>
    )
}