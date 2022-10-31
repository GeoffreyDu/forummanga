import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { back_hostname } from '../../config/index.js'
import { Comment } from '../comments/Comment.jsx'
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import '../../styles/ThemePage.css'

export const ThemePage = ({ user, notifElements }) => {

    const [theme, setTheme] = useState({})
    const [contentCreate, setContentCreate] = useState('')
    const pathnameSplitted = window.location.pathname.split('/')
    const id = pathnameSplitted[pathnameSplitted.length - 1]

    const token = localStorage.getItem('token')
    const fetchData = useCallback(async() => {
        try {
            const response = await axios.get(`${back_hostname}/theme/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            setTheme(response.data.theme)
        } catch (error) {
            console.log(error)
            notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
        // eslint-disable-next-line
    }, [token, id])
    
    useEffect(() => {
        if (id) {
            fetchData()
        }
        return () => {
            setTheme([])
        }

    }, [id, fetchData])

    const commentCreate = async e => {
        e.preventDefault()
        try {   
            const comment = {
                content: contentCreate.trim(),
            }
            const response =  await axios.post(`${back_hostname}/comments/${theme._id}`, comment, { headers: { Authorization: `Bearer ${token}` } } )
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            fetchData()
            setContentCreate('')
        } catch (error) {
            error.response.status === 500 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    const handleChangeCommentCreate = e => {
        setContentCreate(e.target.value)
    }
    
    return (
        <Grid container alignItems="center" justify="center" direction="column">
            {theme ? <div id='themePageContainer'>
                <h2 id='themePageTitle'>{ theme.title }</h2>
                <p id='themePageDescription'>{ theme.description }</p>
                <h4>Ajouter un commentaire</h4>
                { theme.comments && <form id='createCommentForm' onSubmit={e => commentCreate(e)}>
                        <TextField 
                            multiline
                            rows={4}
                            label='Votre commentaire' 
                            name="comment" 
                            id="comment" 
                            onChange={handleChangeCommentCreate} 
                            value={ contentCreate }/>
                        <Button id='createCommentButton' variant='contained' type="submit">Ajouter</Button>
                    </form> }
                <h4>Commentaires</h4>
                { theme.comments ? theme.comments.length > 0
                    ? theme.comments.map((comment, key) => <Comment key={key} indexColor={key} user={user} theme={theme} comment={comment} fetchData={fetchData} notifElements={notifElements}/>) 
                    : <p>Pas encore de commentaires</p> : <p>Mauvaise page</p>}
            </div> : <p>Ce thème n'existe pas ou plus</p> }
        </Grid>
    )
}