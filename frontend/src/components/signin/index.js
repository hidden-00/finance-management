import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar';
import { Box, Container, CssBaseline, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

const theme = createTheme();

const Signin = () => {
    const navigate = useNavigate();
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

    const handleSubmitEvent = async(e) => {
        e.preventDefault()
        if (input.email !== "" && input.password !== "" && input.name !== "") {
            const res = await auth.signinAction(input);
            if (!res.success) {
                setMessage(res.message);
                setOpen(true);
                const timeoutId = setTimeout(() => {
                    setOpen(false);
                }, 3000);
                return () => clearTimeout(timeoutId);
            }
            return;
        } else {
            setMessage("Nhập Đủ Thông Tin")
            setOpen(true);
            const timeoutId = setTimeout(() => {
                setOpen(false);
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }



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
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, mr: 1, width: "45%" }}
                            >
                                Đăng kí
                            </Button>
                            <Button
                                onClick={handleLogin}
                                variant="contained"
                                sx={{ mt: 3, mb: 2, ml: 1, width: "45%" }}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    {message}
                </Alert>
            </Snackbar>
        </>
    )

}

export default Signin;