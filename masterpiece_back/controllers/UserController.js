import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { passwordEncrypter, comparePassword } from "../helpers/helper.js"
import { UserModel } from '../models/User.js'
import { front_origin, secret } from '../config/index.js'
import { sendMail } from '../helpers/mailer.js'

// User creation
export const createUser = async (req, res) => {
    const user = req.body
    user.emailToken = crypto.randomBytes(64).toString('hex')
    if (user.password === user.confirmPassword) {
        delete user.confirmPassword
        try {
            // Encrypt the password before storing in database
            const passwordEncrypted = await passwordEncrypter(user.password)
            user.password = passwordEncrypted
            await UserModel.create(user)
            const mailTemplate = `<h2>${user.username}, merci pour ton inscription</h2>
            <h4>Pour commencer ton aventure avec nous, confirme ton email avec le lien ci-dessous:</h4>
            <a href="http://${req.headers.host}/user/verify-email?token=${user.emailToken}">Vérifie ton email</a>
            `
            await sendMail(
                user.mail, 
                'Vérification du compte', 
                mailTemplate
            )
            res.json ({ message: 'Compte créé. Veuillez vérifier vos mails afin d\'activer votre compte' })
        } catch (error) {
            res.json({ error: error.message })
        }    
    }
    else {
        res.status(400).json({ error: "Le mot de passe et la confirmation ne correspondent pas" })
    }
}

// Middleware to check mail, password and username validation
export const checkUser = async(req, res, next) => {
    const { mail, username, password } = req.body
    try {
        const user = await UserModel.findOne({ mail })
        if(user){
            res.status(400).json({ error: 'Ce mail existe déjà' })
        }
        else if (username.length < 3 || username.length > 100) {
            res.status(400).json({ error: 'Le pseudo doit faire entre 3 et 100 caractères' })
        }
        else if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/.test(password)) {
            next()
        } else {
            res.status(400).json({ error: "Le mot de passe doit contenir minimum 12 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

// Middleware to check password validation
export const checkPassword = async(req, res, next) => {
    const { password } = req.body
    try {
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/.test(password)) {
            next()
        } else {
            res.status(400).json({ error: "Le mot de passe doit contenir minimum 12 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

//Verification of email account
export const verifyUser = async (req, res) => {
    try {
        const emailToken = req.query.token
        const user = await UserModel.findOne({ emailToken })
        if (user) {
            user.emailToken = null
            user.isVerified = true
            await user.save()
            res.json({ message: 'Compte vérifié' })
        }
        else {
            res.status(500).json({error: 'Compte non vérifié' })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

// Connection to user's account
export const login = async (req, res) => {
    try {
        const reqUser = req.body
        const bddUser = await UserModel.findOne({ mail: reqUser.mail })
        if (!bddUser) {
            return res.status(400).json({error: `Le mail ${reqUser.mail} n'existe pas dans notre base de données`})
        }

        if (!bddUser.isVerified) {
            return res.status(400).json({error: "Le compte n'est pas vérifié"})
        }

        const userExists = await comparePassword(reqUser.password, bddUser.password)
        if (userExists) {
            // token to send to the frontend
            const token = jwt.sign(
                { 
                    userId: bddUser._id,
                    username: bddUser.username
                },
                secret,
                { expiresIn: '1h' }
            )
            res.json({ token })     
        } 
        else {
            res.status(401).json({ error: "Mot de passe incorrect"})
        }
    } catch (error) {
        res.json({ error: error.message })
    }
}

// Middleware to access to private operations
export const checkLogged = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, secret)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

// Change the password if forgotten
export const changePasswordRequest = async (req, res) => {
    try {
        const { mail } = req.body
        const user = await UserModel.findOne({ mail: mail })
        if (user) {
            const token = crypto.randomBytes(64).toString('hex')
            user.changePasswordToken = token
            await user.save()
            const mailTemplate = `<h2>Tu as oublié ton mot de passe? Pas de soucis.</h2>
            <h4>Suis le lien ci-dessous pour confirmer ta demande de changement de mot de passe, sinon ne réponds pas à ce mail</h4>
            <a href="${front_origin}/resetPassword?token=${user.changePasswordToken}">Confirme ici</a>`

            await sendMail(
                user.mail, 
                'Mot de passe oublié', 
                mailTemplate
            )
            res.json({ message: 'Demande de changement de mot de passe effectuée. Un mail vous a été envoyé' })
        }
        else {
            res.status(400).json({ error: 'Aucun utilisateur ayant ce mail' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Change the password if forgotten
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body
        if (!token) return res.json({ error: "Erreur de jeton d'authentification" })
        const user = await UserModel.findOne({ changePasswordToken: token })
        if (user && password === confirmPassword) {
            const newSecuredPassword = await passwordEncrypter(password)
            user.password = newSecuredPassword
            user.changePasswordToken = null
            await user.save()
            res.status(200).json({ message: 'Mot de passe mis à jour' })
        }
        else {
            res.status(400).json({ error: 'Echec de la mise à jour du mot de passe' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
