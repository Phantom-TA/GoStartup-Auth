import { useAuth } from "../context/auth.context";

import { useNavigate } from "react-router";
import {Link} from 'react-router'
import { toast } from "react-toastify";
import './Navbar.css'
import logo from '/logo.png'

function Navbar(){
    const { user , logout } =useAuth();
    const navigate = useNavigate();
    const handleLogout = async() =>{
        try{
        await logout();
        toast.success("Logged out successfully")
        navigate('/')
        }
        catch{
            toast.error("error in logging out")
        }
    }

    return (
         <div className="nav-bar">
            <div className="nav-logo-container">
                 <img src={logo} alt="logo" className="nav-logo"/>
                 <h2 className="nav-logo-content">GoStartup</h2>
            </div>
            <div className="nav-list-container">
                <ul className="nav-list">
                    <li className="nav-list-item" style={{color:"rgb(145 138 250)"}}>Home</li>
                    <li className="nav-list-item">Features</li> 
                    <li className="nav-list-item">Pages</li>
                    <li className="nav-list-item">Support</li>
                </ul>
            </div>
         <div className="nav-buttons-container">

            {user ? (
                <div className="auth-buttons">
                <div className="user-display">Hi, {user.name.split(' ')[0]}</div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            ):(
                <div className="auth-buttons">
                    <Link to="/login"><button className="login-button">Login</button></Link>
                    <Link to="signup"><button className="signup-button">Signup</button></Link>
                </div>
            )}
         </div>
         </div>
    )
}
export default Navbar;