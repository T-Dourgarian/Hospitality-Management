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
    TextField,
    Tabs,
    TabPanel,
    Tab,
    Box,
    Typography
} from '@mui/material';
import RoomTypeForcast from './RoomTypeForcast';

import RoomList from './RoomList';

function Notes() {


      useEffect(() => {

      },[])
      
  

    return (
        <Grid container spacing={2} pt={2}>
            <Grid item xs={8}>
                <TextField
                    id="outlined-textarea"
                    label="New Note"
                    multiline
                    fullWidth
                    rows={3}
                />
            </Grid>
            <Grid item>
                <Button 
                    // onClick={handleCheckIn}               
                    variant="contained"
                >Add Note</Button>
            </Grid>
        </Grid>
    );
  }
  
  export default Notes;