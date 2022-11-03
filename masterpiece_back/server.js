import express from "express"
import mongoose from 'mongoose'
import cors from 'cors'
import route from './routes/routes.js'
import { port, db_url, front_origin } from './config/index.js'

mongoose.connect( db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(init)

function init() {
    const app = express()

    // Set the origin
    app.use(cors({
        origin: front_origin
    }))

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    
    // Router
    app.use('/', route)
    
    app.listen(port, () => {
        console.log(`App listen on port ${port} \nConnected with DB`);
    })
}
