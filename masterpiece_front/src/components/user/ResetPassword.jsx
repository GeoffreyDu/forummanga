import { useState } from "react"
import axios from 'axios'
import { back_hostname } from '../../config/index.js'
import { useLocation, useNavigate } from "react-router-dom"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import '../../styles/ResetPassword.css'

// Component to chnage the password of user account
export const ResetPassword = ({ notifElements }) => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const search = useLocation().search
    const token = new URLSearchParams(search).get('token')
    const navigate = useNavigate()

    const handleChangePassword = e => {
        setPassword(e.target.value)
    }
    const handleChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value)
    }

    // first step is to check validity of input
    const handleSubmit = async e => {
        e.preventDefault()
        if (password !== confirmPassword) {
            notifElements.setMessage("les mots de passe ne sont pas identiques")
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
            return
        }
        if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/.test(password)){
            notifElements.setMessage("Le mot de passe doit contenir 12 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial")
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
            return
        }
        // Then make the api call
        try {   
            const response =  await axios.post(`${back_hostname}/user/password-change`, { password, confirmPassword, token })
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            navigate('/login')
        } catch (error) {
            error.response.status === 400 ? notifElements.setMessage(error.response.data.error) : notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    return (
        <div>
            <h1 id="resetPwdTitle">Changement de mot de passe</h1>
            <form id="resetPwdForm" onSubmit={handleSubmit}>
                <Grid container alignItems="center" justify="center" direction="column">
                    <TextField sx={{ mb: 1 }} label="Mot de passe" type="password" name="password" id="password" onChange={handleChangePassword} value={ password }/>
                    <TextField label="Confirmation de mot de passe" type="password" name="confirmPassword" id="confirmPassword" onChange={handleChangeConfirmPassword} value={ confirmPassword }/>
                    <Button type="submit">Envoyer</Button>
                </Grid>
            </form>
        </div>
    )
}