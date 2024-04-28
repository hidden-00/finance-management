import { message } from 'antd';
import { useCallback } from 'react';
import { useContext, createContext, useState, useEffect } from 'react'
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site') || "");
    // const urlAPI = `https://finance-management-zviq.onrender.com`;
    const urlAPI = `http://localhost:5050`;

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
                messageApi.warning(res.msg);
                setTimeout(() => {
                    setToken('');
                    localStorage.removeItem('site')
                    setUser(null);
                }, 500)
            }
        } catch (err) {
            messageApi.error('SERVER ERROR');
        }
    }, [urlAPI, token, messageApi])

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
    return <AuthContext.Provider value={{ setUser, setToken, token, user, loginAction, logOut, signinAction, urlAPI }}>{contextHolder}{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}