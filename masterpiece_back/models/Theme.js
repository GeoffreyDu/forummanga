import mongoose from "mongoose";

const { Schema, model } = mongoose

const ThemeSchema = new Schema({
    title: { type: String, required: true, unique: true, minlength: [3, 'Titre trop court'], maxlength: [100, 'Titre trop long'] },
    description: { type: String, required: true, minlength: [3, 'Description trop courte'], maxlength: [200, 'Description trop longue'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments'
        }
    ]
})

export const ThemeModel = model('themes', ThemeSchema)