import { ThemeModel } from "../models/Theme.js"
import { UserModel } from "../models/User.js"

export const addTheme = async (req, res) => {
    const themeBody = req.body
    themeBody.title = themeBody.title.trim()
    themeBody.description = themeBody.description.trim()
    const { userId } = req.auth
    try {
        const user = await UserModel.findById(userId)
        // check if user exists
        if(user){
            themeBody.author = user._id
            const theme = await ThemeModel.create(themeBody)
            user.themes.push(theme._id)
            await user.save()
            res.status(201).json ({ message: 'thème créé' })
        } else {
            res.status(400).json ({ message: 'Erreur dans la création de thème' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteTheme = async(req, res) => {
    try {
        const { userId } = req.auth
        const themeId = req.params.id
        const user = await UserModel.findById(userId)
        const theme = await ThemeModel.findOne({ _id: themeId })
        if (user && theme.author.equals(userId)) {
            await ThemeModel.deleteOne({ _id: themeId })
            // delete theme in user's collection
            user.themes = user.themes.filter(userThemeId => !userThemeId.equals(themeId))
            await user.save()
            res.json({ message: 'thème supprimé'})
        } else {
            res.status(400).json({ error: 'Erreur dans la suppression de thème' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateTheme = async(req, res) => {
    try {
        const { userId } = req.auth
        const themeId = req.params.id
        const themeBody = req.body
        // check theme validations
        if (themeBody.title.length < 3 
            || themeBody.title.length > 100 
            || themeBody.description.length < 3) {
                res.status(400).json({ error: 'Le titre doit faire entre 3 et 100 caractères et la description minimum 3' })
                return
        }
        themeBody.title = themeBody.title.trim()
        themeBody.description = themeBody.description.trim()
        const theme = await ThemeModel.findOne({ _id: themeId })
        if (Object.keys(themeBody).length === 2 
            && theme.author.equals(userId) 
            && themeBody.title.length > 0 
            && themeBody.description.length > 0) {
            await ThemeModel.updateOne({ _id: themeId }, themeBody)
            res.json({ message: 'thème modifié'})
        } else {
            res.status(400).json({ error: 'Les champs ne doivent pas être vides' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllThemes = async(req, res) => {
    try {
        const themes = await ThemeModel.find({}, { title: 1 })
        res.json({ themes })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getOneTheme = async(req, res) => {
    const themeId = req.params.id
    try {
        const theme = await ThemeModel
            .findOne({ _id: themeId })
            .populate({ path: 'comments', populate: { path: 'author', select: 'username'} })

        res.json({ theme })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getUserTheme = async(req, res) => {
    const { userId } = req.auth
    try {
        const themes = await ThemeModel.find({ author: userId })
        res.json({ themes }) 
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}