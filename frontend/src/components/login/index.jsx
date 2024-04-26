import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import { Alert, Button, LoaderBusy } from "react-windows-ui";
import { Box, Container, CssBaseline, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

const theme = createTheme();

const Login = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
    })
    const [message, setMessage] = useState('');
    const [load, setLoad] = useState(false);
    const [open, setOpen] = useState(false);
    const [checklogin, setChecklogin] = useState(false);
    const [response, setResponse] = useState(null);

    const handleRegistration = () => {
        navigate('/signin');
    };

    const auth = useAuth();

    const handleSubmitEvent = async (e) => {
        e.preventDefault()
        setLoad(true);
        const res = await auth.loginAction(input);
        setTimeout(() => {
            setLoad(false);
            if (!res.success) {
                setMessage(res.msg);
                setOpen(true);
            } else {
                setMessage(res.msg);
                setChecklogin(true);
                setResponse(res);
            }
        }, 500);
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
            <LoaderBusy
                isLoading={load}
                display="overlay"
                onBackdropPress={() => { }}
            />
            <Helmet>
                <title>Login</title>
            </Helmet>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Đăng nhập
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmitEvent}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={handleInput}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleInput}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        style={{ margin: '20px' }}
                                        value='Login'
                                        type="primary"
                                        icon={<i className="icons10-home"></i>}
                                        onClick={handleSubmitEvent}
                                    />
                                    <Button
                                        style={{ margin: '20px' }}
                                        value='Register'
                                        type="primary-outline"
                                        icon={<i className="icons10-share"></i>}
                                        onClick={handleRegistration}
                                    />
                                </div>
                            </div>

                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <Alert
                isVisible={open}
                onBackdropPress={() => { }}>
                <Alert.Header>
                    <p style={{ padding: 10 }}>
                        {message}
                    </p>
                </Alert.Header>
                <Alert.Footer>
                    <Button
                        type="primary"
                        value="OK"
                        onClick={() => { setOpen(false) }}
                    />
                </Alert.Footer>
            </Alert>
            <Alert
                isVisible={open}
                onBackdropPress={() => { }}>
                <Alert.Header>
                    <p style={{ padding: 10 }}>
                        {message}
                    </p>
                </Alert.Header>
                <Alert.Footer>
                    <Button
                        type="primary"
                        value="OK"
                        onClick={() => { setOpen(false) }}
                    />
                </Alert.Footer>
            </Alert>
            <Alert
                isVisible={checklogin}
                onBackdropPress={() => { }}>
                <Alert.Header>
                    <p style={{ padding: 10 }}>
                        {message}
                    </p>
                </Alert.Header>
                <Alert.Footer>
                    <Button
                        type="primary"
                        value="OK"
                        onClick={() => {
                            setChecklogin(false);
                            auth.setUser(response.data);
                            auth.setToken(response.token);
                            localStorage.setItem("site", response.token)
                            navigate('/dashboard')
                        }}
                    />
                </Alert.Footer>
            </Alert>
        </>
    )

}

export default Login;