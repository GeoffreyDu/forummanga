import mongoose from "mongoose";

const { Schema, model } = mongoose

const UserSchema = new Schema({
    username: { type: String, required: true, minlength: [3, 'Pseudo trop court'], maxlength: [100, 'Pseudo trop long'] },
    mail: { 
        type: String, 
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Le mail est invalide"
        },
        required: [true, "Mail obligatoire"]
     },
    password: { type: String, required: true, minlength: [12, 'Mot de passe trop court'] },
    emailToken: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    changePasswordToken: { type: String, default: null },
    accountCreationDate: { type: Date, default: Date.now() },
    themes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "themes"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments"
        }
    ]
})

export const UserModel = model('users', UserSchema)