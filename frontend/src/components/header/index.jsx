import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../../provider/auth';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, Snackbar, TextField } from '@mui/material';
import { Helmet } from 'react-helmet';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [data, setData] = useState([]);
    const [form, setForm] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: ""
    })
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [load, setLoad] = useState(false);
    const [shouldFetchData, setShouldFetchData] = useState(false);

    const sendRequestAddGroup = async () => {
        try {
            const response = await fetch(`${auth.urlAPI}/api/v1/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                },
                body: JSON.stringify({
                    name: input.name,
                    description: input.description,
                })
            })
            const res = await response.json();
            if (res.success) {
                setStatus('success');
                setOpen(true)
                setMessage(res.msg);
                handleDrawerClose();
                setForm(false);
                setShouldFetchData(true);
            } else {
                setStatus('warning');
                setOpen(true)
                setMessage(res.msg);
                throw new Error(res.msg);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const fetchData = useCallback(async () => {
        try {
            setLoad(true);
            const response = await fetch(`${auth.urlAPI}/api/v1/group/list_name`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                }
            })
            const res = await response.json();
            if (res.success) {
                setData(res.data.groups);
            } else {
                throw new Error(res.msg)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    }, [auth.token, auth.urlAPI])

    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
            setShouldFetchData(false); // Đặt lại trạng thái shouldFetchData để tránh việc lặp lại việc fetch data
        }
    }, [fetchData, shouldFetchData])
    
    useEffect(() => {
        fetchData(); // Fetch data ban đầu khi component được render
    }, [fetchData])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCloseForm = () => {
        setForm(false);
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleInput = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleButtonAdd = () => {
        setForm(true);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendRequestAddGroup();
    }

    if (load) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </div>

    return (
        <>
            <Helmet>
                <title>{auth.user?.name}</title>
            </Helmet>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={handleDrawerClose}
                            sx={{ width: 240 }}
                        >
                            <div>
                                {/* Your logo or additional header content here */}
                                <AppBar position="static" sx={{ marginBottom: 2 }} onClick={() => { navigate('/dashboard') }}>
                                    <Toolbar>
                                        <Typography variant="h6" noWrap component="div">
                                            {auth.user?.name}
                                        </Typography>
                                    </Toolbar>
                                </AppBar>
                            </div>
                            <List>
                                <ListItem button onClick={handleButtonAdd}>
                                    <ListItemIcon><LibraryAddIcon /></ListItemIcon>
                                    <ListItemText primary="Add Group" />
                                </ListItem>
                                {data && data.map(group => (
                                    <ListItem key={group._id} button onClick={() => {
                                        handleDrawerClose();
                                        return navigate(`/finance/${group._id}`)
                                    }}>
                                        <ListItemIcon><PaymentIcon /></ListItemIcon>
                                        <ListItemText primary={group.name} />
                                    </ListItem>

                                ))}
                            </List>
                        </Drawer>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                        </Typography>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { navigate('/profile') }}>Profile</MenuItem>
                                <MenuItem onClick={() => { navigate('/logs') }}>Log Login</MenuItem>
                                <MenuItem onClick={() => { auth.logOut() }}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <Dialog open={form} onClose={handleCloseForm}>
                <DialogTitle>Add a new financial expenditure group</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField name="name" onChange={handleInput} sx={{ m: 1 }} label="Group Name" fullWidth />
                        <TextField name="description" onChange={handleInput} sx={{ m: 1 }} label="Description" fullWidth />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm}>Hủy</Button>
                    <Button color="primary" onClick={handleSubmit}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseMessage}>
                <Alert onClose={handleClose} severity={status}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}