import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useLocation } from "react-router-dom";

function Configuration() {
    const [sensorId, setSensorId] = useState('');
    const [userId, setUserId] = useState('');
    const [sensors, setSensors] = useState([]);
    const [selectedSensorId, setSelectedSensorId] = useState('');
    const [thresholdValue, setThresholdValue] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/users/auto_login`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUserId(data.user_id);
                    return fetch(`${process.env.REACT_APP_BACKEND_URL}/sensors/find_by_user_id?user_id=${data.user_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                })
                .then(response => response.json())
                .then(sensorsData => {
                    if (Array.isArray(sensorsData)) {
                        setSensors(sensorsData);
                    } else {
                        setSensors([]);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching sensors!', error);
                });
        }
    }, []);

    const handleAddSensor = () => {
        if (!sensorId) {
            alert('Sensor ID cannot be empty.');
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sensors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sensor: {
                    sensor_id: sensorId,
                    user_id: userId
                }
            })
        })
            .then(response => response.json())
            .then(() => {
                return fetch(`${process.env.REACT_APP_BACKEND_URL}/sensor_thresholds`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sensor_threshold: {
                            sensor_id: sensorId
                        }
                    })
                });
            })
            .then(response => response.json())
            .then(() => {
                alert('Sensor added successfully.');
                setSensorId('');
            })
            .catch(error => {
                console.error('There was an error adding the sensor!', error);
                alert('Error adding sensor. Please try again.');
            });
    };

    const handleConfirmThreshold = () => {
        if (!thresholdValue || isNaN(thresholdValue) || thresholdValue >= 80) {
            alert('Threshold value must be a number below 80.');
            return;
        }
        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sensor_thresholds/edit_threshold`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify({
                sensor_id: selectedSensorId,
                threshold_value: thresholdValue
            })
        })
            .then(response => response.json())
            .then(() => {
                alert('Threshold value updated successfully.');
                setThresholdValue('');
            })
            .catch(error => {
                console.error('There was an error updating the threshold!', error);
                alert('Error updating threshold. Please try again.');
            });
    };

    return (
        <React.Fragment>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <TextField
                                label="Register New Sensor"
                                value={sensorId}
                                onChange={(e) => setSensorId(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2, mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <Button variant="contained" color="primary" onClick={handleAddSensor}>
                                            Add
                                        </Button>
                                    )
                                }}
                            />
                            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                <InputLabel id="sensor-select-label">Select Sensor</InputLabel>
                                <Select
                                    labelId="sensor-select-label"
                                    value={selectedSensorId}
                                    label="Select Sensor"
                                    onChange={(e) => setSelectedSensorId(e.target.value)}
                                >
                                    {sensors.map((sensor) => (
                                        <MenuItem key={sensor.sensor_id} value={sensor.sensor_id}>
                                            {sensor.sensor_id}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Set Threshold Value"
                                value={thresholdValue}
                                onChange={(e) => setThresholdValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <Button variant="contained" color="primary" onClick={handleConfirmThreshold}>
                                            Confirm
                                        </Button>
                                    )
                                }}
                            />
                        </Paper>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
}

export default Configuration;
