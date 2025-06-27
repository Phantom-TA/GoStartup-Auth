
import { BrowserRouter as Router , Routes , Route } from "react-router"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Home from "./components/Home.jsx"
import { ToastContainer } from 'react-toastify'
import './App.css'
import { AuthProvider } from "./context/auth.context.jsx"

function App() {
  

  return (
    <AuthProvider>
     <Router>
      <Routes>
         <Route path='/' element={<Home />} /> 
         <Route path='/login' element={<Login />} /> 
         <Route path='/Signup' element={<Signup />} />  
      </Routes>
      <ToastContainer position="top-center" autoClose={4000}/>
     </Router>
     </AuthProvider>
  
  )
}

export default App
