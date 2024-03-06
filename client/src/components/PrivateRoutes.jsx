import { Outlet, Navigate } from 'react-router-dom'
import store from '../redux/store.js'

export default function PrivateRoutes() {

    let user = store.getState().userReducer.currentUser
    let auth = false

    
    if (user) {
        if (user.username != null) auth = true
    }

    return (
        auth ? <Outlet/> : <Navigate to="/"/>
    )
}