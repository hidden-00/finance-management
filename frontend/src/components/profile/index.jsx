import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../provider/auth";
import { Button, CircularProgress, TextField } from "@mui/material";

export default function Profile() {
    const [data, setData] = useState(null);
    const auth = useAuth();
    const emailRef = useRef();
    const nameRef = useRef();
    const [load, setLoad] = useState(false);

    const sendRequestGetData = useCallback(async () => {
        try {
            setLoad(true);
            const response = await fetch(`${auth.urlAPI}/api/v1/user/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                }
            })
            const res = await response.json();
            if (res.success) {
                setData(res.data);
            } else {
                throw new Error(res.msg);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false)
        }
    },[auth.token, auth.urlAPI])

    useEffect(() => {
        const fetchData = async()=>{
            await sendRequestGetData();
        }
        fetchData();
    }, [sendRequestGetData])

    if (load) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </div>
    return (
        <div style={{textAlign:"center"}}>
            <form style={{ margin: 30 }}>
                <TextField inputRef={emailRef} defaultValue={data?.email} sx={{ m: 1, width: '50%' }} label="Email" />
                <TextField inputRef={nameRef} defaultValue={data?.name} sx={{ m: 1, width: '50%' }} label="Name" />
            </form>
            <Button
                type="submit"
                variant="contained"
                sx={{ mr: 1 }}
            >
                Save
            </Button>
        </div>
    )
}