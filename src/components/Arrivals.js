import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Grid,
    Paper,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    TextField
} from '@mui/material';

import ReservationTable from './ReservationsTable';

function Arrivals() {

    const [arrivals, setArrivals] = useState([]);


    useEffect(() => {
        const getArrivals = async () => {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/arrivals`);

          setArrivals(response.data)
        }

        getArrivals();

    },[])

    return (
        <Grid container direction="column" spacing={2} pt={4}>
            <Grid item width="100%">
                <ReservationTable reservations={arrivals} />
            </Grid>
        </Grid>
    );
  }
  
  export default Arrivals;