import express from 'express'
import { addTheme, deleteTheme, updateTheme, getAllThemes, getOneTheme, getUserTheme } from '../controllers/ThemeController.js'
import { addComment, deleteComment, getAllCommentsByTheme, getAllCommentsByUser, updateComment } from '../controllers/CommentController.js'
import { 
    checkLogged,
    checkPassword, 
    createUser, 
    verifyUser, 
    login, 
    changePasswordRequest, 
    resetPassword
 } from '../controllers/UserController.js'

const router = express.Router()

// user routes
router.post('/users', checkPassword, createUser)
router.get('/user/verify-email', verifyUser)
router.post('/user/password-forgotten', changePasswordRequest)
router.post('/user/password-change', checkPassword, resetPassword)
router.post('/login', login)

// themes routes
router.post('/themes', checkLogged, addTheme)
router.get('/themes', checkLogged, getAllThemes)
router.get('/theme/:id', checkLogged, getOneTheme)
router.get('/user/themes', checkLogged, getUserTheme)
router.put('/user/theme/:id', checkLogged, updateTheme)
router.delete('/user/theme/:id', checkLogged, deleteTheme)

// comments routes
router.post('/comments/:id', checkLogged, addComment)
router.get('/theme/comments/:id', checkLogged, getAllCommentsByTheme)
router.get('/user/comments', checkLogged, getAllCommentsByUser)
router.delete('/comments/:id', checkLogged, deleteComment)
router.put('/comments/:id', checkLogged, updateComment)

export default router