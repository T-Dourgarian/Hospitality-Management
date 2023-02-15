import Grid from '@mui/material/Grid'; // Grid version 1
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Arrivals() {

    const [arrivals, setArrivals] = useState([]);


    useEffect(() => {
        const getArrivals = async () => {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/arrivals`);

          setArrivals(response.data)
        }

        getArrivals();

    },[])

    const showArrivals = arrivals.map( arrival => {
        <Grid item>
            <div>{arrival.check_in}</div>
        </Grid>
    })
    return (
        <Grid container direction="row" spacing={2}>
            {showArrivals}
        </Grid>
    );
  }
  
  export default Arrivals;