import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Spin, Typography, message } from "antd";

const Register = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        name: ""
    })
    const [load, setLoad] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin = () => {
        navigate('/login');
    };

    const auth = useAuth();

    const handleSubmitEvent = async (e) => {
        try {
            e.preventDefault()
            setLoadButton(true);
            setLoad(true);
            const res = await auth.signinAction(input);
            setTimeout(() => {
                if (!res.success) {
                    setLoadButton(false);
                    setLoad(false);
                    messageApi.info(res.msg)
                } else {
                    messageApi.success(res.msg)
                    setTimeout(() => {
                        navigate('/login');
                    }, 500);
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
                <title>Register</title>
            </Helmet>
            <Form style={{
                width: "30%",
                margin: "0 auto",
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "#fff"
            }}>
                <Typography.Title level={2}>Register</Typography.Title>
                <Typography.Title level={5}>Email</Typography.Title>
                <Input name='email' autoComplete='email' autoFocus onChange={handleInput} placeholder='Email' />
                <Typography.Title level={5}>Password</Typography.Title>
                <Input name='password' autoComplete='password-current' autoFocus onChange={handleInput} type='password' placeholder='Password' />
                <Typography.Title level={5}>Full Name</Typography.Title>
                <Input name='name' autoComplete='name' autoFocus onChange={handleInput} placeholder='Full name' />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ margin: '20px' }}
                            type="primary"
                            loading={loadButton}
                            onClick={handleSubmitEvent}
                        >Register</Button>
                        <Button
                            style={{ margin: '20px' }}
                            type="primary"
                            onClick={handleLogin}
                        >Login</Button>
                    </div>
                </div>
            </Form>
        </>
    )

}

export default Register;