import {useContext, createContext, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site')||"");
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5050/api/v1/user/info", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });
    
                const res = await response.json();
                if (res.success) {
                    setUser(res.data);
                } else {
                    setToken('');
                    localStorage.removeItem('site')
                    navigate('/login');
                    throw new Error(res.message);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    },[])

    const loginAction = async(data)=>{
        try{
            const response = await fetch("http://localhost:5050/api/v1/user/login",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await response.json()
            if(res.success){
                setUser(res.data);
                setToken(res.token);
                localStorage.setItem("site", res.token)
                navigate('/dashboard')
            }
            return res;
        }catch(err){
            console.error(err);
        }
    }

    const signinAction = async(data)=>{
        try{
            const response = await fetch("http://localhost:5050/api/v1/user",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await response.json()
            if(res.success){
                navigate('/login')
                return res;
            }else{
                if(res.errors.keyPattern.email){
                    res.message = "Email tồn tại"
                    return res;
                }
            }
            throw new Error(res.message);
        }catch(err){
            console.error(err);
        }
    }

    const logOut = async()=>{
        try{
            const response = await fetch("http://localhost:5050/api/v1/user/logout",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            })
            const res = await response.json()
            if(res.success){
                setUser(null)
                setToken('')
                localStorage.removeItem('site')
                navigate('/login')
            }
            throw new Error(res.message)
        }catch(err){
            console.error(err);
        }
    }
    return <AuthContext.Provider value={{token, user, loginAction, logOut, signinAction}}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = ()=>{
    return useContext(AuthContext);
}