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

// import { useSelector, useDispatch } from 'react-redux'

import { useNavigate } from "react-router-dom";

function ReservationTable({ reservations, setFilteredReservations, setResFocus  }) {


    const navigate = useNavigate();



    const handleNavigate = (reservation_id) => {
        navigate(`/frontdesk/${reservation_id}`)
        setFilteredReservations([]);
        setResFocus(null);
    }

    return (
        <Grid container direction="column" sx={{position: 'absolute !important', width:'83% !important'}}>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
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
                        {reservations && reservations.map( reservation => 
                            <TableRow
                                key={reservation.reservation_id}
                                onMouseDown={() => handleNavigate(reservation.reservation_id)}
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
                                    {reservation.name_short}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.status}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {reservation.rate}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
  }
  
  export default ReservationTable;