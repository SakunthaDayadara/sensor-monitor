import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Outlet, useNavigate} from 'react-router-dom';
import useAuth from "../Hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import {ListItems} from "./ListItem";



const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);


const defaultTheme = createTheme();

export default function Dashboard() {
    const [open, setOpen] = React.useState(true);
    const [userData, setUserData] = React.useState(null);

    const { setAuth } = useAuth();
    const navigate = useNavigate();


    const toggleDrawer = () => {
        setOpen(!open);
    };

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch token from local storage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                // Fetch user data using token
                const autoLoginResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/auto_login`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!autoLoginResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const autoLoginData = await autoLoginResponse.json();

                // Fetch additional user info using user ID
                const findUserResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/find_by_user_id?user_id=${autoLoginData.user_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!findUserResponse.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const userData = await findUserResponse.json();

                // Update state with user data
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    const handleLogout = () => {
        // Clear user session data
        localStorage.removeItem('token');
        setAuth({ isAuthenticated: false, role: null, token: null });
        // Redirect to login page
        navigate('/');
    };


    return (

        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {userData && userData.name && `Welcome, ${userData.name}`}
                        </Typography>
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" onClick={handleLogout}>
                            <Badge color="secondary">
                                <LogoutIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        {ListItems}
                    </List>
                </Drawer>

                <Outlet />

            </Box>
        </ThemeProvider>

    );
}
