import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { back_hostname } from '../../config/index.js'
import { useNavigate } from 'react-router-dom'
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import '../../styles/Login.css'

// Component to access to user's account
export const Login = ({ setUser, notifElements }) => {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleChangeMail = e => {
        setMail(e.target.value)
    }
    const handleChangePassword = e => {
        setPassword(e.target.value)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {   
            const user = {
                mail,
                password
            }
            const response =  await axios.post(`${back_hostname}/login`, user )
            // handle reponse to display it to the user
            notifElements.setMessage('Connexion réussie')
            notifElements.setSeverity("success")
            notifElements.setOpen(true)
            localStorage.setItem('token', response.data.token)
            const token = localStorage.getItem('token')
            const foundUser = jwt_decode(token)
            setUser(foundUser)
            navigate('/themes')
        } catch (error) {
            // handle error
            console.log(error)
            notifElements.setMessage(error.response.data.error)
            notifElements.setSeverity("error")
            notifElements.setOpen(true)
        }
    }

    return (
        <div id="loginContainer">
            <form id="loginForm" onSubmit={handleSubmit}>
                <Grid container alignItems="center" justify="center" direction="column">
                    <h2 id='titleConnexion'>Connexion</h2>
                    <TextField style={{ marginBottom: '5px' }} label='Adresse mail' type="text" name="mail" id="loginMail" onChange={handleChangeMail} value={ mail }/>
                    <TextField style={{ marginBottom: '5px' }} label='Mot de passe' type="password" name="password" id="loginPassword" onChange={handleChangePassword} value={ password }/>
                    <Button type="submit" style={{ color: '#BC002D' }}>Envoyer</Button>
                    <a id='passwordForgotten' href="/passwordForgotten">Mot de passe oublié?</a>
                </Grid>
            </form>
        </div>
    )
}