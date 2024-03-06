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
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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

    React.useEffect(() => {
        fetchData();
    }, [])

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

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
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
                                <ListItem button>
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
        </>
    );
}