import Grid from '@mui/material/Grid'; // Grid version 1
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MMDD from '../utils/formatDate';

function Arrivals() {

    const [arrivals, setArrivals] = useState([]);


    useEffect(() => {
        const getArrivals = async () => {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/arrivals`);

          setArrivals(response.data)

          console.log(response.data);
        }

        getArrivals();

    },[])

    return (
        <Grid container direction="row" spacing={2}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell> # of Nights</TableCell>
                            <TableCell>Room #</TableCell>
                            <TableCell>Room Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {arrivals && arrivals.map( arrival => 
                            <TableRow
                                key={arrival.id}
                            >
                                <TableCell component="th" scope="row">
                                    { arrival.last_name }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { arrival.first_name }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { MMDD(arrival.check_in) }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { MMDD(arrival.check_out) }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { arrival.num_of_nights }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { arrival.room_number ? arrival.room_number : 'N/A' }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {arrival.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {arrival.status}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {arrival.rate}
                                </TableCell>
                                {/* <TableCell align="right">{calories}</TableCell> */}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
  }
  
  export default Arrivals;