import Grid from '@mui/material/Grid'; // Grid version 1
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Paper,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    TextField
} from '@mui/material';

import ReservationModal from './ReservationModal';

function ReservationTable({ reservations }) {


    return (
        <Grid container direction="column" spacing={2} pt={4}>
            <Grid item width="100%">
                <TextField 
                    id="standard-basic" 
                    label="Standard" 
                    variant="standard" 
                />
            </Grid>
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations && reservations.map( reservation => 
                            <TableRow
                                key={reservation.id}
                            >
                                <TableCell component="th" scope="row">
                                    { reservation.last_name }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { reservation.first_name }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { MMDD(reservation.check_in) }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { MMDD(reservation.check_out) }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { reservation.num_of_nights }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    { reservation.room_number ? reservation.room_number : 'N/A' }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.status}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.rate}
                                </TableCell>
                                <TableCell component="th" scope="row">

                                    <ReservationModal reservation={reservation} buttonText={'open'} />
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
  
  export default ReservationTable;