import { useState, useEffect } from 'react'
import axios from 'axios'
import { back_hostname } from '../../config/index.js'
import { Theme } from './Theme.jsx'
import { useNavigate } from 'react-router-dom'
import Grid from "@mui/material/Grid"
import Box from '@mui/material/Box'
import '../../styles/Themes.css'

export const Themes = ({ notifElements }) => {
    const [themes, setThemes] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const response =  await axios.get(`${back_hostname}/themes`, { headers: { Authorization: `Bearer ${token}` } })
                setThemes(response.data.themes)  
            } catch (error) {
                notifElements.setMessage(error.message)
                notifElements.setSeverity("error")
                notifElements.setOpen(true)
            }
        }
        fetchData()

        return () => {
            setThemes([])
        }
        // eslint-disable-next-line
    }, [])

    const handleClick = (id) => {
        navigate(`/theme/${id}`)
    }

    return (
        <Grid container alignItems="center" justify="center" direction="column">
            <Box justify='center' sx={{ width: '100%', maxWidth: 800 }}>
                <h2 id='themesTitle'>Themes</h2>
                <h3 id='themesSubTitle'>Voici les différents thèmes, si tu veux parler d'autre chose, n'hésite pas à créer le tien en cliquant <span id='spanGoHome' onClick={() => navigate('/home')}>ici</span></h3>
                {themes.length > 0 
                    ? themes.map((theme, key) => <Theme key={key} theme={theme} goToComponent={() => handleClick(theme._id)}/>) 
                    : <p>Aucun thèmes présents</p>
                }
            </Box>
        </Grid> 
    )
}