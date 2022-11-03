import { CommentModel } from "../models/Comment.js"
import { ThemeModel } from "../models/Theme.js"
import { UserModel } from "../models/User.js"

export const addComment = async(req, res) => {
    try {
        const { userId } = req.auth
        const themeId = req.params.id
        const commentBody = req.body
        const user = await UserModel.findById(userId)
        const theme = await ThemeModel.findById(themeId)
        // check user and theme exist before continue
        if (user && theme) {
            commentBody.content = commentBody.content.trim()
            commentBody.author = user._id
            commentBody.themeId = theme._id
            const comment = await CommentModel.create(commentBody)
            theme.comments.push(comment)
            await theme.save()
            user.comments.push(comment)
            await user.save()
            res.json({ message: 'commentaire créé'})
        } else {
            res.status(400).json({error: 'Erreur dans le création de commentaire'})
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllCommentsByTheme = async(req, res) => {
    try {
        const themeId = req.params.id
        const comments = await CommentModel.find({ themeId }).sort({ date: -1 })
        res.json({ comments })    
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllCommentsByUser = async(req, res) => {
    try {
        const { userId } = req.auth
        const comments = await CommentModel.find({ author: userId }).sort({ date: -1 })
        res.json({ comments })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateComment = async(req, res) => {
    try {
        const { userId } = req.auth
        const commentId = req.params.id
        const commentBody = req.body
        // check content's length
        if (commentBody.content.length < 3) {
            res.status(400).json({ error: 'Le contenu doit faire minimum 3 caractères' })
                return
        }
        commentBody.content = commentBody.content.trim()
        commentBody.date = Date.now()
        const comment = await CommentModel.findOne({ _id: commentId })
        if (Object.keys(commentBody).length === 2 && comment.author.equals(userId)) {
            await CommentModel.updateOne({ _id: commentId }, commentBody)
            res.json({ message: 'commentaire modifié'})
        } else {
            res.status(400).json({ error: 'Erreur dans la modification de commentaire. Le champ ne doit pas être vide' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

export const deleteComment = async(req, res) => {
    try {
        const { userId } = req.auth
        const commentId = req.params.id
        const user = await UserModel.findById(userId)
        const comment = await CommentModel.findOne({ _id: commentId })
        const theme = await ThemeModel.findOne({ _id: comment.themeId })
        if (user && comment.author.equals(userId)) {
            await CommentModel.deleteOne({ _id: commentId })
             // delete comment in theme's collection
             theme.comments = theme.comments.filter(themeCommentId => !themeCommentId.equals(commentId))
             await theme.save()
             // delete comment in user's collection
             user.comments = user.comments.filter(userCommentId => !userCommentId.equals(commentId))
             await user.save()
             res.json({ message: 'commentaire supprimé'})
        } else {
            res.status(400).json({ error: 'Erreur dans la suppression de commentaire' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}