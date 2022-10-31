import { useState } from 'react'
import axios from 'axios'
import { back_hostname } from '../../config/index.js'
import { Popup } from '../Popup'
import ListItem from '@mui/material/ListItem'
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import DescriptionIcon from '@mui/icons-material/Description'
import '../../styles/Theme.css'

export const Theme = ({ theme, goToComponent, getThemesList, notifElements }) => {
    const [titleUpdate, setTitleUpdate] = useState(theme.title)
    const [descriptionUpdate, setDescriptionUpdate] = useState(theme.description)
    
    // popup handler
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    
    const token = localStorage.getItem('token')
    const endpoint = window.location.pathname

    const togglePopupUpdate = () => {
        setIsOpenUpdate(!isOpenUpdate)
        setIsOpenDelete(false)
    }

    const togglePopupDelete = () => {
        setIsOpenDelete(!isOpenDelete)
        setIsOpenUpdate(false)
    }

    const handleChangeTitleUpdate = e => {
        setTitleUpdate(e.target.value)
    }
    
    const handleChangeDescriptionUpdate = e => {
        setDescriptionUpdate(e.target.value)
    }

    const themeUpdate = async (e, themeId) => {
        e.preventDefault()
        try {
            const theme = {
                title: titleUpdate.trim(),
                description: descriptionUpdate.trim()
            }
            const response = await axios.put(`${back_hostname}/user/theme/${themeId}`, theme, { headers: { Authorization: `Bearer ${token}` } })
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)  
            getThemesList()
            togglePopupUpdate()
        } catch (error) {
            error.response.status === 400 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    const themeDelete = async (themeId) => {
        try {
            const response = await axios.delete(`${back_hostname}/user/theme/${themeId}`, { headers: { Authorization: `Bearer ${token}` } })
            console.log(response.data)
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true) 
            getThemesList()
            togglePopupDelete()
        } catch (error) {
            console.log(error)
            notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText className='listThemeName' onClick={goToComponent}>{ theme.title[0].toUpperCase() + theme.title.slice(1) }</ListItemText>
                { endpoint === '/home' ? <div>
                    <Button className='userThemeOpButton' onClick={togglePopupUpdate}>Modifier</Button>
                    { isOpenUpdate && <Popup
                        content={<>
                            <h2 id='themePopupUpdateTitle'>Modifier thème</h2>
                            <form onSubmit={ e => themeUpdate(e, theme._id) }>
                                <Grid container alignItems="center" justify="center" direction="column">
                                    <TextField sx={{ mb: 2 }} label='Titre' type="text" name="title" id="title" onChange={ handleChangeTitleUpdate } value={ titleUpdate }/>
                                    <TextField 
                                        label='Description' 
                                        multiline
                                        rows={4}
                                        name="description" 
                                        id="description" 
                                        onChange={ handleChangeDescriptionUpdate } 
                                        value={ descriptionUpdate }/>
                                    <Button className='userThemeOpButton' type="submit">Modifier</Button>
                                </Grid>
                            </form>
                        </>}
                        handleClose={togglePopupUpdate}
                    />}
                    <Button className='userThemeOpButton' onClick={togglePopupDelete}>Supprimer</Button>
                    { isOpenDelete && <Popup
                        content={<>
                            <h2 id='themePopupDeleteTitle'>Etes-vous sûr de vouloir supprimer ?</h2>
                            <Grid container alignItems="center" justify="center" direction="column">
                                <Button onClick={() => themeDelete(theme._id)}>Oui</Button>
                                <Button className='userThemeOpButton' onClick={togglePopupDelete}>Annuler</Button>
                            </Grid>
                        </>}
                        handleClose={togglePopupDelete}
                    />}
                </div> : <DescriptionIcon /> }
            </ListItemButton>
        </ListItem>
    )
}