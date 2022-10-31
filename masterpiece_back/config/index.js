import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.APP_PORT || 8000
export const hostname = process.env.APP_HOSTNAME || 'localhost'
export const db_url = process.env.DB_URL
export const secret = process.env.SECRET
export const app_mail = process.env.SMTP_MAIL
export const smtp_password = process.env.SMTP_PASSWORD
export const front_origin = process.env.FRONT_ORIGIN