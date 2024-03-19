import { useCallback, useState } from "react"
import { useAuth } from "../../provider/auth";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function LogLogin() {
    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const auth = useAuth();

    const sendRequestGetData = useCallback(async () => {
        try {
            setLoad(true)
            const response = await fetch(`${auth.urlAPI}/api/v1/user/logs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                },
            })
            const res = await response.json();
            if (res.success) {
                setStatus('success');
                setOpen(true)
                setMessage(res.msg);
            } else {
                throw new Error(res.msg);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    }, [auth.token, auth.urlAPI]);

    useEffect(()=>{
        sendRequestGetData();
    },[sendRequestGetData]);

    if (load) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </div>
    return <>
        {message}
    </>
}