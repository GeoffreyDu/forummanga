import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CommentSchema = new Schema({
    content: { type: String, required: true, minlength: [3, 'Contenu trop court'] },
    creationDate: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'themes', required: true }
})

export const CommentModel = model('comments', CommentSchema)