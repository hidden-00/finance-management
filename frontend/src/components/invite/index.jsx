import React, { useCallback, useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../provider/auth';
const Invite = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [load, setLoad] = useState(false);
    const auth = useAuth();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);

    const callApiAcceptRequest = useCallback(async () => {
        try {
            setLoad(true);
            const response = await fetch(`${auth.urlAPI}/api/v1/group/invite?code=${searchParams.get('code')}&status=accept`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                }
            })
            const res = await response.json();
            if (res.success) {
                setOpenSuccess(true);
            } else setOpenWarning(true);
            setTimeout(() => {
                setLoad(false);
            }, 500);
        } catch (err) {
            navigate('/server-error')
        }
    }, [auth.token, auth.urlAPI, navigate, searchParams])

    useEffect(() => {
        callApiAcceptRequest()
    }, [callApiAcceptRequest])

    return (
        <>
            <Spin spinning={load} fullscreen />
            {(openSuccess) ? (<Result
                status="success"
                title='Successfully Join Group.'
            />) : (openWarning) ? (<Result
                status="success"
                title={`Successfully Join Group.`} />) : (<></>)}

                {
                    setTimeout(()=>{
                        navigate('/group')
                    },1000 )
                }
        </>
    )

    // if (status) {
    //     return (
    //         <>
    //             <Result
    //                 status="success"
    //                 title={`Successfully Join Group.`}
    //             />
    //             {
    //                 setTimeout(() => {
    //                     navigate('/group')
    //                 }, 1000)
    //             }

    //         </>
    //     )
    // } else if (!status) {
    //     return (
    //         <>
    //             <Result
    //                 status="warning"
    //                 title="Invitation is not valid."

    //             />
    //             {
    //                 setTimeout(() => {
    //                     navigate('/group')
    //                 }, 1000)
    //             }
    //         </>
    //     )
    // }
    // return (<Spin spinning={load} fullscreen />)


};
export default Invite;