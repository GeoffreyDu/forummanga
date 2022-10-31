import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar/Navbar.jsx'
import { LoggedNavbar } from './components/navbar/LoggedNavbar.jsx'
import { Signin } from './components/user/Signin.jsx'
import { Login } from './components/user/Login.jsx'
import { Themes } from './components/themes/Themes.jsx'
import { ThemePage } from './components/themes/ThemePage.jsx'
import { Home } from './components/user/Home.jsx'
import { PasswordForgotten } from './components/user/PasswordForgotten.jsx'
import { ResetPassword } from './components/user/ResetPassword.jsx'
import { PrivateRoute } from './components/PrivateRoute.jsx'
import { tokenExpired } from './helpers/helper.js'
import jwt_decode from 'jwt-decode'
import { Notification } from './components/Notification.jsx'

function App() {
  // message handler
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState("info")
  // login handler
  const [token] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState({})
  
  useEffect(() => {
    if (token) {
      const foundUser = jwt_decode(token)
      setUser(foundUser)
    }
    setInterval(() => {
      let expired = tokenExpired(token)
      if (expired) {
        setUser({})
      }
  }, 3600001)
  }, [token])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  const notifElements = {
    message,
    setOpen,
    setMessage,
    setSeverity
  }

  
  return (
    <div>
      { Object.keys(user).length !== 0 ? <LoggedNavbar setUser={setUser} notifElements={notifElements}/> : <Navbar/> }
      <Routes>
        <Route path='/' element={ <Signin notifElements={notifElements}/> } />
        <Route path='/login' element={ <Login setUser={setUser} notifElements={notifElements}/> } />
        <Route path='/home' element={ <PrivateRoute><Home user={user} notifElements={notifElements}/></PrivateRoute> } />
        <Route path='/themes' element={ <PrivateRoute><Themes notifElements={notifElements}/></PrivateRoute> } />
        <Route path='/theme/:id' element={ <PrivateRoute><ThemePage user={user} notifElements={notifElements}/></PrivateRoute> } />
        <Route path='/passwordForgotten' element={ <PasswordForgotten notifElements={notifElements}/> } />
        <Route path='/resetPassword' element={ <ResetPassword notifElements={notifElements}/> } />
      </Routes>
      <Notification open={open} message={message} severity={severity} handleClose={handleClose}/>
    </div>
  );
}

export default App;
