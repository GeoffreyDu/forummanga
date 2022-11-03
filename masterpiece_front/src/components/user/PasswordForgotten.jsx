import { useState } from "react"
import axios from 'axios'
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { back_hostname } from '../../config/index.js'
import '../../styles/PasswordForgotten.css'

// Component to send demand to change password
export const PasswordForgotten = ({ notifElements }) => {
    const [mail, setMail] = useState('')

    const handleChangeMail = e => {
        setMail(e.target.value)
    }
    
    const handleSubmit = async e => {
        e.preventDefault()
        try {   
            const response =  await axios.post(`${back_hostname}/user/password-forgotten`, { mail })
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
        } catch (error) {
            error.response.status === 400 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    return (
        <div>
            <h1 id="pwdForgottenTitle">Mot de passe oublié</h1>
            <form id="pwdForgottenForm" onSubmit={handleSubmit}>
            <p id="pwdForgottenText">Veuillez entrer votre adresse mail afin que nous puissions vous envoyer la procédure de changement de mot de passe</p>
                <Grid container alignItems="center" justify="center" direction="column">
                    <TextField label="Adresse mail" type="text" name="mail" id="mail" onChange={handleChangeMail} value={ mail }/>
                    <Button type="submit">Envoyer</Button>
                </Grid>
            </form>
        </div>
    )
}