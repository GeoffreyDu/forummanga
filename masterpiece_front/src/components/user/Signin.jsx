import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { back_hostname } from '../../config/index.js'
import '../../styles/Signin.css'
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

export const Signin = ({ notifElements }) => {
    const [username, setUsername] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const handleChangeUsername = e => {
        setUsername(e.target.value)
    }
    const handleChangeMail = e => {
        setMail(e.target.value)
    }
    const handleChangePassword = e => {
        setPassword(e.target.value)
    }
    const handleChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value)
    }
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
        try {   
            const user = {
                username,
                mail,
                password,
                confirmPassword
            }
            const response =  await axios.post(`${back_hostname}/users`, user )
            console.log(response);
            notifElements.setMessage(response.data.message)
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            navigate('/login')
        } catch (error) {
            notifElements.setMessage(error.message)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    return (
        <div id='home'>
            <div id="homeImage">
                <h1>JapanForum</h1>
                <h2>Bienvenue sur notre forum si vous aimez l'univers manga, rejoignez-nous</h2>
                <h3>Pour vous inscrire <span id="arrowDesktop">c'est ici -&gt;</span> <span id="arrowMobile">c'est en dessous</span></h3>
                <h3>Sinon <span id="linkLogin" onClick={() => navigate('/login')}>connectez-vous</span></h3>
            </div>
            <form id="signinForm" onSubmit={handleSubmit}>
                <h2 id='titleInscription'>Inscription</h2>
                <Grid container alignItems="center" justify="center" direction="column">
                    <TextField style={{ marginBottom: '5px' }} type="text" label="Pseudo" name="username" id="username" onChange={handleChangeUsername} value={ username }/>
                    <TextField style={{ marginBottom: '5px' }} type="text" label="Adresse mail" name="mail" id="mail" onChange={handleChangeMail} value={ mail }/>
                    <TextField style={{ marginBottom: '5px' }} type="password" label="Mot de passe" name="password" id="password" onChange={handleChangePassword} value={ password }/>
                    <TextField style={{ marginBottom: '5px' }} type="password" label="Confirmation du mot de passe" name="confirmPassword" id="confirmPassword" onChange={handleChangeConfirmPassword} value={ confirmPassword }/>
                    <Button style={{ color: '#BC002D' }} type="submit">Envoyer</Button>
                </Grid>
            </form>
        </div>
    )
}