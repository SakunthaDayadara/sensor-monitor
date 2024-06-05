import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";


const defaultTheme = createTheme();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Register() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [telephone, setTelephone] = useState("");
    const [otp, setOtp] = useState("");
    const [savedOtp, setSavedOtp] = useState("");
    const [open, setOpen] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [sensorId, setSensorId] = useState("");
    const [sensorIdError, setSensorIdError] = useState("");
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [userId, setUserId] = useState("");

    const handleTelephoneChange = (event) => {
        setTelephone(event.target.value);
        setIsVerified(false);
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleVerifyClick = () => {
        if (!telephone) {
            alert('Please enter your telephone number.');
            return;
        }
        const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setSavedOtp(randomOtp);

        const to = `94${telephone.slice(-9)}`;
        const text = `Your One Time Password for verifying your number is ${randomOtp}`;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/send_otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, text })
        })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    alert('Your OTP has been sent.');
                    setTelephone(to);
                    setOpen(true);
                } else {
                    alert('Failed to send OTP.');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleOtpConfirm = () => {
        if (otp === savedOtp) {
            setIsVerified(true);
            setOpen(false);
            alert('Telephone number verified successfully.');
        } else {
            alert("OTP doesn't match.");
        }
    };

    const handleModalClose = () => {
        if (window.confirm('Are you sure you want to close the verification modal? You will need to verify your number again.')) {
            setOpen(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isVerified) {
            alert('Please verify your telephone number before submitting.');
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);

        const userData = {
            user: {
                username: formData.get('username'),
                password: formData.get('password'),
                name: formData.get('Name'),
                email: formData.get('Email'),
                telephone: formData.get('telephone')
            }
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`);
            const existingUsers = await response.json();

            const usernameTaken = existingUsers.some(user => user.username === userData.user.username);
            const telephoneTaken = existingUsers.some(user => user.telephone === userData.user.telephone);
            const emailTaken = existingUsers.some(user => user.email === userData.user.email);

            if (usernameTaken || telephoneTaken || emailTaken) {
                if (usernameTaken) {
                    alert('Username is already taken.');
                }

                if (telephoneTaken) {
                    alert('Telephone number is already taken.');
                }
                return;
            }

            const submitResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (submitResponse.ok) {
                alert('User registered successfully. ');

                const loginData = {
                    username: formData.get('username'),
                    password: formData.get('password')
                };

                const loginResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                if (loginResponse.ok) {
                    const loginResult = await loginResponse.json();
                    localStorage.setItem('token', loginResult.token);
                    setAuth({ isAuthenticated: true, token: loginResult.token });
                    setUserId(loginResult.user_id);
                    // Open sensor registration modal
                    setSensorModalOpen(true);
                } else {
                    console.error('Failed to login:', loginResponse.statusText);
                }
            } else {
                console.error('Failed to submit form:', submitResponse.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSensorIdChange = (event) => {
        const value = event.target.value;
        setSensorId(value);
        if (!/^\d{4}$/.test(value)) {
            setSensorIdError('Sensor ID must be a 4-digit number.');
        } else {
            setSensorIdError('');
        }
    };

    const handleSensorRegistration = async () => {
        if (!sensorId) {
            alert('Please enter a 4-digit Sensor ID.');
            return;
        }

        try {
            const sensorData = {
                sensor: {
                    sensor_id: sensorId,
                    user_id: userId // Assuming this is the user ID, you may need to adjust it
                }
            };

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sensors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sensorData)
            });

            if (response.ok) {
                alert('Sensor registered successfully.');

                const sensorThresholdData = {
                    sensor_threshold: {
                        sensor_id: sensorId
                    }
                };

                const thresholdResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sensor_thresholds`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sensorThresholdData)
                });

                if (thresholdResponse.ok) {
                    setSensorModalOpen(false);
                    navigate('/dashboard');
                } else {
                    console.error('Failed to set sensor thresholds:', thresholdResponse.statusText);
                }
            } else {
                console.error('Failed to register sensor:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-name"
                                    name="Name"
                                    required
                                    fullWidth
                                    id="Name"
                                    label="Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-email"
                                    name="Email"
                                    required
                                    fullWidth
                                    id="Email"
                                    label="Email"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        required
                                        fullWidth
                                        name="telephone"
                                        label="Telephone"
                                        id="telephone"
                                        autoComplete="telephone"
                                        value={telephone}
                                        onChange={handleTelephoneChange}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{ ml: 2 }}
                                        onClick={handleVerifyClick}
                                        disabled={isVerified}
                                        style={{ backgroundColor: isVerified ? 'green' : '' }}
                                    >
                                        {isVerified ? 'Verified' : 'Verify'}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Enter OTP
                        </Typography>
                        <TextField
                            fullWidth
                            label="OTP"
                            variant="outlined"
                            margin="normal"
                            value={otp}
                            onChange={handleOtpChange}
                        />
                        <Button
                            variant="contained"
                            onClick={handleOtpConfirm}
                            sx={{ mr: 2 }}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleModalClose}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
                <Modal
                    open={sensorModalOpen}
                    onClose={() => setSensorModalOpen(false)}
                    aria-labelledby="sensor-modal-title"
                    aria-describedby="sensor-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="sensor-modal-title" variant="h6" component="h2">
                            Register Your First Sensor
                        </Typography>
                        <TextField
                            fullWidth
                            label="Sensor ID"
                            variant="outlined"
                            margin="normal"
                            value={sensorId}
                            onChange={handleSensorIdChange}
                            error={!!sensorIdError}
                            helperText={sensorIdError}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSensorRegistration}
                            sx={{ mt: 2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </Modal>
            </Container>
        </ThemeProvider>
    );
}
