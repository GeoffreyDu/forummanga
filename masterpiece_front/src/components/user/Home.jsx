import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popup } from '../Popup.jsx'
import { Theme } from '../themes/Theme.jsx'
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { back_hostname } from '../../config/index.js'
import '../../styles/Home.css'
import img1 from '../../images/1.jpg'
import img2 from '../../images/2.jpg'
import img3 from '../../images/3.jpg'

// Component user account home page
export const Home = ({ user, notifElements }) => {
    // popup handler
    const [isOpen, setIsOpen] = useState(false)
    
    // popup form
    const [titleCreate, setTitleCreate] = useState("")
    const [descriptionCreate, setDescriptionCreate] = useState("")

    // list of user's themes
    const [themes, setThemes] = useState([])
    
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    // set random welcome image
    const imgTab = [img1, img2, img3]
    const [img] = useState(imgTab[Math.floor(Math.random() * 3)])
    
    const getThemesList = useCallback(async() => {
        try {
            const response = await axios.get(`${back_hostname}/user/themes`, { headers: { Authorization: `Bearer ${token}` } })
            setThemes(response.data.themes)
        } catch (error) {
            notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
        // eslint-disable-next-line
    }, [token])

    useEffect(() => {  
        getThemesList()
        return () => {
            setThemes([])
        }
    }, [getThemesList])

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }
    
    const handleChangeTitleCreate = e => {
        setTitleCreate(e.target.value)
    }
    
    const handleChangeDescriptionCreate = e => {
        setDescriptionCreate(e.target.value)
    }
 
    const themeCreation = async e => {
        e.preventDefault()
        try {   
            const theme = {
                title: titleCreate.trim(),
                description: descriptionCreate.trim()
            }
            const response =  await axios.post(`${back_hostname}/themes`, theme, { headers: { Authorization: `Bearer ${token}` } } )
            getThemesList()
            setTitleCreate('')
            setDescriptionCreate('')
            // handle response
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            togglePopup()
        } catch (error) {
            // handle error
            error.response.status === 500 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    // to go to the theme page
    const handleClick = (id) => {
        navigate(`/theme/${id}`)
    }

    return (
        <div id='homeContainer'>
            <h1 id='homeTitle'>Bienvenue {user.username}</h1>
            <img id='welcomeBanner' src={img} alt="welcome_banner" />
            { isOpen && <Popup
                content={<>
                    <Alert severity="info">Le titre doit faire entre 3 et 100 caractères et la description minimum 3</Alert>
                    <h2 id='themePopupCreateTitle'>Création de thème</h2>
                    <form onSubmit={themeCreation}>
                        <Grid container alignItems="center" justify="center" direction="column">
                            <TextField sx={{ mb: 1 }} label="Titre" type="text" name="title" id="title" onChange={handleChangeTitleCreate} value={ titleCreate }/>
                            <TextField
                                label="Description"
                                name="description" 
                                id="description"
                                multiline
                                rows={4}
                                onChange={handleChangeDescriptionCreate} value={ descriptionCreate }/>
                            <Button id='themePopupCreateButton' type="submit">Créer</Button>
                        </Grid>
                    </form>
                </>}
                handleClose={togglePopup}
                />}
            <Grid container alignItems="center" justify="space-between" direction="column">
                <Box justify='space-between' sx={{ width: '100%', maxWidth: 800 }}>
                    <div id='containerlistTitle'>
                        <h2 id='listThemeTitle'>Mes thèmes</h2>
                        <Button id='createThemeButton' variant="contained" onClick={togglePopup}>Créer un thème</Button>
                    </div>
                    <List>
                        { themes && themes.length > 0 
                            ? themes.map((theme, key) => <Theme key={key} theme={theme} goToComponent={() => handleClick(theme._id)} getThemesList={getThemesList} notifElements={notifElements}/>)
                            : <p>Pas de thèmes</p> }
                    </List>
                </Box>
            </Grid>
        </div>
    )
}