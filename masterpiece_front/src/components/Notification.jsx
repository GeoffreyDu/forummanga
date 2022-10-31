import { useState, useEffect } from "react"
import { Snackbar } from "@mui/material"
import Alert from '@mui/material/Alert'

export const Notification = ({ open, message, severity, handleClose }) => {
    const [vertical, setVertical] = useState('bottom')
    const horizontal = 'center'
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 800) {
                setVertical('top')
            } else{
                setVertical('bottom')
            }
        }
        window.addEventListener('resize', handleResize)
    })

    return (    
        <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: vertical, horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}