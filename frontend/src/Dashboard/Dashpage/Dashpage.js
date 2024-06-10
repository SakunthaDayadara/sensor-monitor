import React, { useState, useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

const Dashpage = () => {
    const [selectedSensor, setSelectedSensor] = useState('');
    const [sensorData, setSensorData] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [userId, setUserId] = useState("");

    const handleSensorChange = (event) => {
        const selectedSensorId = event.target.value;
        setSelectedSensor(selectedSensorId);
        fetchSensorData(selectedSensorId);
    };

    const fetchSensorData = async (sensorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sensor_data/find_by_user_id?user_id=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch sensor data');
            }
            const data = await response.json();
            const filteredData = data.filter(d => d.sensor_id === sensorId).map(d => ({
                ...d,
                timestamp: `${d.date_column} ${d.time_column}`
            }));
            setSensorData(filteredData);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/auto_login`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await response.json();
            const userId = userData.user_id;
            setUserId(userId);
            fetchSensors(userId);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchSensors = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sensors/find_by_user_id?user_id=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch sensor data');
            }
            const sensorData = await response.json();
            setSensors(sensorData);
            if (sensorData.length > 0) {
                const defaultSensorId = sensorData[0].sensor_id;
                setSelectedSensor(defaultSensorId);
                fetchSensorData(defaultSensorId);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        let interval;
        if (selectedSensor) {
            fetchSensorData(selectedSensor);
            interval = setInterval(() => {
                fetchSensorData(selectedSensor);
            }, 5000); // Polling interval set to 5 seconds

            return () => clearInterval(interval); // Clear the interval when the component unmounts or sensor changes
        }
    }, [selectedSensor]);

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
                    <Grid item xs={12}>
                        <FormControl sx={{ m: 1, minWidth: 120, paddingBottom: '20px', paddingTop: '10px' }} size="small">
                            <InputLabel>Select Sensor</InputLabel>
                            <Select
                                value={selectedSensor}
                                onChange={handleSensorChange}
                                style={{ width: 150 }}
                            >
                                {sensors.map(sensor => (
                                    <MenuItem key={sensor.sensor_id} value={sensor.sensor_id}>
                                        Sensor {sensor.sensor_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={sensorData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="linear" dataKey="data_value" stroke="#8884d8" strokeWidth={2} name={"Sensor Value"} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Sensor Readings</Typography>
                        <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '280px', scrollbarWidth: 'none' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>ID</b></TableCell>
                                        <TableCell><b>Date</b></TableCell>
                                        <TableCell><b>Time</b></TableCell>
                                        <TableCell><b>Sensor Read</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ overflowY: 'scroll' }}>
                                    {sensorData.map((data, index) => (
                                        <TableRow key={data.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
                                            <TableCell>{data.id}</TableCell>
                                            <TableCell>{data.date_column}</TableCell>
                                            <TableCell>{data.time_column}</TableCell>
                                            <TableCell>{data.data_value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Dashpage;
