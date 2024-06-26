import { useCallback } from 'react';
import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site') || "");
    const urlAPI = `https://5pyzfz-5050.csb.app`;
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
                setUser(null);
            }
        } catch (err) {
            navigate('/server-error')
        }
    }, [urlAPI, token, navigate])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const loginAction = async (data) => {
        const response = await fetch(`${urlAPI}/api/v1/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const res = await response.json()
        return res;
    }

    const signinAction = async (data) => {
        const response = await fetch(`${urlAPI}/api/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        return res;
    }

    const logOut = async () => {
        const response = await fetch(`${urlAPI}/api/v1/user/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        })
        const res = await response.json()
        return res;
    }
    return <AuthContext.Provider value={{ setUser, setToken, token, user, loginAction, logOut, signinAction, urlAPI }}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}