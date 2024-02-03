import { useState } from 'react'
import { useAuth } from '../../provider/auth'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar';
import { Box, Container, CssBaseline, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';

const theme = createTheme();

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    })

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const auth = useAuth();

    const handleSubmitEvent = (e) => {
        e.preventDefault()
        if (input.email !== "" && input.password !== "") {
            auth.loginAction(input);
            return;
        } else {
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Nhập đủ thông tin
                </Alert>
            </Snackbar>
        </>
    )

}

export default Login;