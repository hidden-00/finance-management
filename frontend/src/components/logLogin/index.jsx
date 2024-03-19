import { useCallback, useState } from "react"
import { useAuth } from "../../provider/auth";

export default function LogLogin(){
    const [load, setLoad] = useState(false);
    const auth = useAuth();

    const sendRequestGetData = useCallback(async()=>{
        
    },[])

    return <>
    </>
}