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

import ReservationDialog from './ReservationDialog';

function RoomList({ reservations, getReservations, roomList, getRoomList, roomTypes={roomTypes} }) {

    useEffect(() => {
        
    }, [])


    return (
        <Grid container direction="column" spacing={2} pt={4}>
            {/* <Grid item width="100%">
                <TextField 
                    id="standard-basic" 
                    size="small"
                    label="Last Name" 
                    variant="outlined" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Grid> */}

            <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Last Name</TableCell>
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
                                {/* <TableCell align="right">{calories}</TableCell> */}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
  }
  
  export default RoomList;