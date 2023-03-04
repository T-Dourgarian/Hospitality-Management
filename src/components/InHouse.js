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

function InHouse() {

    const [inHouse, setInHouse] = useState([]);


    useEffect(() => {
        const getInHouse = async () => {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/inhouse`);

          setInHouse(response.data)
        }

        getInHouse();

    },[])

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item width="100%">
                <ReservationTable reservations={inHouse} />
            </Grid>
        </Grid>
    );
  }
  
  export default InHouse;