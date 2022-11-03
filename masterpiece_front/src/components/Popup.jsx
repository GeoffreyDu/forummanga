import '../styles/popup.css'

// Component to display forms to the user
export const Popup = props => {
    return (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={props.handleClose}>x</span>
            {props.content}
          </div>
        </div>
    )
}
