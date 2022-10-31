import express from "express"
import mongoose from 'mongoose'
import cors from 'cors'
import { fileURLToPath } from "url";
import path from "path";
import route from './routes/routes.js'
import { port, db_url, front_origin } from './config/index.js'

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.connect( db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(init)

function init() {
    const app = express()
    // set the view engine to ejs
    app.set('view engine', 'pug')
    app.set("views", path.join(__dirname, "views"))

    app.use(cors({
        origin: front_origin
    }))

    app.use(express.static(path.join(__dirname, "public")));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    
    // Router
    app.use('/', route)
    
    app.listen(port, () => {
        console.log(`App listen on port ${port} \nConnected with DB`);
    })
}
