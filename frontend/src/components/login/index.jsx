import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Button, Form, message, Input, Spin, Typography } from "antd";

const Login = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
    })
    const [load, setLoad] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleRegistration = () => {
        navigate('/register');
    };

    const auth = useAuth();

    const handleSubmitEvent = async (e) => {
        try {
            e.preventDefault()
            setLoadButton(true);
            setLoad(true);
            const res = await auth.loginAction(input);
            setTimeout(() => {
                if (!res.success) {
                    setLoadButton(false);
                    setLoad(false);
                    messageApi.info(res.msg)
                } else {
                    messageApi.success(res.msg)
                    setTimeout(() => {
                        auth.setUser(res.data);
                        auth.setToken(res.token);
                        localStorage.setItem("site", res.token)
                        navigate('/dashboard');
                    }, 1000);
                }
            }, 500);
        } catch (err) {
            navigate('/server-error')
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    if (auth.token) return navigate('/');

    return (
        <>
            {contextHolder}
            <Spin spinning={load} fullscreen />
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Form style={{
                width: "30%",
                margin: "0 auto",
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "#fff"
            }}>
                <Typography.Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Login</Typography.Title>

                <Typography.Title level={5}>Email</Typography.Title>
                <Input name='email' autoFocus autoComplete='email' onChange={handleInput} placeholder='Email' />
                <Typography.Title level={5}>Password</Typography.Title>
                <Input name='password' autoFocus autoComplete='current-password' onChange={handleInput} placeholder='Password' type='password' />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ margin: '20px' }}
                            type="primary"
                            loading={loadButton}
                            onClick={handleSubmitEvent}
                        >Login</Button>
                        <Button
                            style={{ margin: '20px' }}
                            type="primary"
                            onClick={handleRegistration}
                        >Register</Button>
                    </div>
                </div>
            </Form >
        </>
    )

}

export default Login;