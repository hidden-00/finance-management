import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar';
import { Box, Container, CssBaseline, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-windows-ui';

const theme = createTheme();

const Signin = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [input, setInput] = useState({
        email: "",
        password: "",
        name: ""
    })

    const [message, setMessage] = useState('');


    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const auth = useAuth();

    const handleSubmitEvent = async (e) => {
        e.preventDefault()
        const res = await auth.signinAction(input);
        if (!res.success)
            setStatus('warning');
        else
            setStatus('success');

        setMessage(res.msg);
        setOpen(true);
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
            <Helmet>
                <title>Signin</title>
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
                            Đăng kí
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="name"
                                label="Tên"
                                type="text"
                                id="name"
                                autoComplete="current-name"
                                onChange={handleInput}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        style={{ margin: '20px' }}
                                        value='Register'
                                        type="primary"
                                        icon={<i className="icons10-home"></i>}
                                        onClick={handleSubmitEvent}
                                    />
                                    <Button
                                        style={{ margin: '20px' }}
                                        value='Login'
                                        type="primary-outline"
                                        icon={<i className="icons10-share"></i>}
                                        onClick={handleLogin}
                                    />

                                </div>
                            </div>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={status}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )

}

export default Signin;