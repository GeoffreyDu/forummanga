import axios from 'axios'
import { useState } from 'react'
import { Popup } from '../Popup.jsx'
import { back_hostname } from '../../config/index.js'
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import '../../styles/Comment.css'

// Component who represents the structure of a comment
export const Comment = ({ indexColor, user, theme, comment, fetchData, notifElements }) => {
    const [contentUpdate, setContentUpdate] = useState(comment.content)

    // popup handler
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const token = localStorage.getItem('token')
    const date = new Date(comment.date)
    const dateFormatted = 'le ' + date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR')

    const togglePopupUpdate = () => {
        setIsOpenUpdate(!isOpenUpdate)
        setIsOpenDelete(false)
    }

    const togglePopupDelete = () => {
        setIsOpenDelete(!isOpenDelete)
        setIsOpenUpdate(false)
    }

    const handleChangeContentUpdate = e => {
        setContentUpdate(e.target.value)
    }

    const commentUpdate = async (e, commentId) => {
        e.preventDefault()
        try {
            const commentBody = {
                content: contentUpdate.trim()
            }
            const response = await axios.put(`${back_hostname}/comments/${commentId}`, commentBody, { headers: { Authorization: `Bearer ${token}` } })
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            // to refresh data  
            fetchData()
            // to close popup after submitting
            togglePopupUpdate()
        } catch (error) {
            console.log(error)
            error.response.status === 400 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    const themeDelete = async (commentId) => {
        try {
            const response = await axios.delete(`${back_hostname}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            // to refresh data   
            fetchData()
            // to close popup after submitting
            togglePopupDelete()
        } catch (error) {
            console.log(error)
            notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }
   
    return(
        <div className={indexColor % 2 === 0 ? 'oddCommentColor': 'evenCommentColor'}>
            <div className='commentInfoContainer'>
                <p className='commentInfo'>{comment.author._id === theme.author ? comment.author.username + '(Auteur)' : comment.author.username}</p>
                <p className='pDateComment'>{dateFormatted}</p>
            </div>
            <p className='commentContent'>{comment.content}</p>
            { user.userId === comment.author._id && <div>
                <Button className='commentFormButtons' onClick={togglePopupUpdate}>Modifier</Button>
                { isOpenUpdate && <Popup
                    content={<>
                        <form onSubmit={ e => commentUpdate(e, comment._id) }>
                            <h3 className='updateCommentTitle'>Modifier commentaire</h3>
                            <Grid container alignItems="center" justify="center" direction="column">
                                <TextField multiline rows={4} label="Contenu" type="text" name="content" id="content" onChange={ handleChangeContentUpdate } value={ contentUpdate }/>
                                <Button className='commentFormButtons' type="submit">Modifier</Button>
                            </Grid>
                        </form>
                    </>}
                    handleClose={togglePopupUpdate}
                />}
                <Button className='commentFormButtons' onClick={togglePopupDelete}>Supprimer</Button>
                { isOpenDelete && <Popup
                    content={<>
                        <h3 className='deleteCommentTitle'>Etes-vous sûr de vouloir supprimer ?</h3>
                        <Grid container alignItems="center" justify="center" direction="column">
                            <Button onClick={() => themeDelete(comment._id)}>Oui</Button>
                            <Button className='commentFormButtons' onClick={togglePopupDelete}>Annuler</Button>
                        </Grid>
                    </>}
                    handleClose={togglePopupDelete}
                />}
            </div>}
        </div>
    )
}