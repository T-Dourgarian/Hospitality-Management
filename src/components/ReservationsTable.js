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

import ReservationDialog from './ReservationDialog';

function ReservationTable({ reservations }) {

    const [filteredReservations, setFilteredReservations] = useState(reservations);

    const [lastName, setLastName] = useState('');

    useEffect( () => {
        setFilteredReservations(
            reservations.filter( res => res.last_name.toLowerCase().includes(lastName))
        )
    }, [lastName])


    useEffect(() => {
        setFilteredReservations(reservations);
    }, [reservations])


    return (
        <Grid container direction="column" spacing={2} pt={4}>
            <Grid item width="100%">
                <TextField 
                    id="standard-basic" 
                    size="small"
                    label="Last Name" 
                    variant="outlined" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Grid>
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservations && filteredReservations.map( reservation => 
                            <TableRow
                                key={reservation.reservation_id}
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
                                <TableCell component="th" scope="row">

                                    <ReservationDialog reservation={reservation} buttonText={'open'} />
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