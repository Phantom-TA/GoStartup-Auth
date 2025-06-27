import { createContext , useContext , useEffect , useState } from 'react'
import apiClient from '../../service/apiClient.js'

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user,setUser]= useState(null)
    const [loading , setLoading]= useState(true);
      
    const fetchUser =async ( ) =>{
        try{
            const data = await apiClient.getUser();
             if(data.success)
                setUser(data.data.user)
            else
                setUser(null)
        }
        catch{
            setUser(null)
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchUser();
        
    },[])

    const login = (userData) => setUser(userData)
    const logout = async() => { 
        await apiClient.logout();
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user,login,logout,loading ,fetchUser}}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth(){
    return useContext(AuthContext)
}

