import { useCallback } from 'react';
import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site') || "");
    const urlAPI = `https://finance-management-zviq.onrender.com`;
    // const urlAPI = `http://localhost:5050`;
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${urlAPI}/api/v1/user/info`, {
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
                throw new Error(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    },[urlAPI, token])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const loginAction = async (data) => {
        try {
            const response = await fetch(`${urlAPI}/api/v1/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await response.json()
            if (res.success) {
                setUser(res.data);
                setToken(res.token);
                localStorage.setItem("site", res.token)
                navigate('/dashboard')
            }
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    const signinAction = async (data) => {
        try {
            const response = await fetch(`${urlAPI}/api/v1/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await response.json()
            if (res.success) {
                return res;
            } else {
                if (res.errors.keyPattern?.email) {
                    res.msg = "Email tồn tại"
                    return res;
                }
            }
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    const logOut = async () => {
        try {
            const response = await fetch(`${urlAPI}/api/v1/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            })
            const res = await response.json()
            if (res.success) {
                setUser(null)
                setToken('')
                localStorage.removeItem('site')
                navigate('/login')
            }
            throw new Error(res.message)
        } catch (err) {
            console.error(err);
        }
    }
    return <AuthContext.Provider value={{ token, user, loginAction, logOut, signinAction, urlAPI }}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}