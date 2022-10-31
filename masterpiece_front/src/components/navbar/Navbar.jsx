import { NavLink } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import '../../styles/Navbar.css'

export const Navbar = () => {

    return (
        <nav id='navbar'>
            <NavLink id='homeIcon' to='/'>
                <IconButton style={{color: 'white' }}>
                        <HomeIcon />
                </IconButton>
            </NavLink>
            <p id='titleSignin'>JapanForum</p>
            <div id='navbarMenuSignin'>
                <NavLink className='items duo' style={{ textDecoration: 'none' }} to='/'>Inscription</NavLink>
                <NavLink className='items duo' style={{ textDecoration: 'none' }} to='/login'>Connexion</NavLink>
            </div>
        </nav>
                
    )
}