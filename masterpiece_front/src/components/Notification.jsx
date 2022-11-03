import { Snackbar } from "@mui/material"
import Alert from '@mui/material/Alert'

// Component to display error and success messages to the user
export const Notification = ({ open, message, severity, handleClose }) => {
    const horizontal = 'center'
    const vertical = 'bottom'
    
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