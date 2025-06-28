import { useState } from "react"
import { useNavigate } from "react-router";
import apiClient from "../../service/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import img1 from "/dashboard-pic-1.jpg"
import "./auth.css"
import { Link } from "react-router";
function Login(){

    
    const [ email, setEmail] = useState("");
    const [ password , setPassword] = useState("");
    const [ error , setError ] = useState("");
    const [ loading , setLoading ]= useState(false)
    const { login } = useAuth()
    const navigate = useNavigate();
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        setError('');

        try {
            console.log("Logging in")
            const data = await apiClient.login(email  , password)
            console.log('Login response:' ,data)

            if(data.success){
                login(data.data.user)
                toast.success('Login successful!')
                navigate('/');
            }
            else{
                toast.error(data.data.message || 'Login failed. Please try again')
                setError(data.data.message || 'Login failed. Please try again')
                
            }
        } catch (error) {
            console.error('Login error:',error)
            setError(error.message || 'An error occured during Login')
        }
        finally{
            setLoading(false)
        }

    }
    return (
        <div className="auth-page">
            <div className="auth-img-container">
            </div>
            <div className="auth-details-container">
            <h1 className="auth-header">Login</h1>
              
            <form onSubmit={handleSubmit} className="auth-form">
                
               
                    <label htmlFor="Email">Email </label>
                    <input 
                    type="email" 
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                
                
                    <label htmlFor="password">Password </label>
                    <input 
                    type="password" 
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                
                <div className="forgot">
                <a>Forgot password?</a>
                </div>
                <button className="auth-submit-button"
                type="submit"
                disabled={loading}
                >
                    {loading ? 'Login...' : 'Tushar'}
                    
                </button>
                <div className="register">
                Don’t have an account? <Link to="/signup">Register</Link>
                </div>
            </form>
          { error && <div>{error}</div> }
        </div>
        </div>
    )
}
export default Login
