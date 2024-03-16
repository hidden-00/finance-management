import { useEffect, useState } from "react";
import { useAuth } from "../../provider/auth";
import { TextField } from "@mui/material";

export default function Profile() {
    const [data, setData] = useState(null);
    const auth = useAuth();

    const sendRequestGetData = async () => {
        try {
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
        }
    }

    useEffect(() => {
        sendRequestGetData()
    },[])

    return (
        <>
            <form>
                <TextField name="email" sx={{ m: 1, width: '50%' }} label="Email" />
                <TextField name="name" sx={{ m: 1, width: '50%' }} label="Name" />
            </form>
        </>
    )
}