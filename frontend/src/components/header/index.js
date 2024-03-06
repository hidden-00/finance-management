import * as React from 'react';
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
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, List, ListItem, ListItemIcon, ListItemText, Snackbar, TextField } from '@mui/material';
import { Helmet } from 'react-helmet';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const [form, setForm] = React.useState(false);
    const [input, setInput] = React.useState({
        name: "",
        description: ""
    })
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [add, setAdd] = React.useState(false);

    React.useEffect(() => {
        fetchData();
    }, [add])

    const fetchData = async () => {
        try {
            setLoad(true);
            const response = await fetch('http://localhost:5050/api/v1/group/list_name', {
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
    }

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
        setAdd(true);
        await sendRequestAddGroup();
        setAdd(false)
        setForm(false);
    }

    const sendRequestAddGroup = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/v1/group', {
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
            } else {
                throw new Error(res.msg);
            }
        } catch (err) {
            console.error(err);
        }
    }



    if (load) return <></>
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
                                    <ListItem button onClick={() => { navigate(`/finance/${group._id}`) }}>
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