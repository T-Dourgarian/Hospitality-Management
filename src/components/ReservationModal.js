import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationModal.css'
import MMDD from '../utils/formatDate';
import { 
    Button,
    Dialog ,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Input,
    InputLabel
} from '@mui/material';

function ReservationModal({ reservation, buttonText} ) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          {buttonText}
        </Button>
        <Dialog open={open} >
          <DialogTitle> {reservation.last_name}, {reservation.first_name} </DialogTitle>
          <DialogContent>
            <Grid container direction="row" spacing={12}>
                <InputLabel htmlFor="component-disabled">Last Name</InputLabel>
                <Input id="component-disabled" defaultValue={reservation.last_name} />
            </Grid>
            {/* <Grid container direction="row" spacing={12}>
                <Grid item>
                    <div className='ReservationModalLabel'>
                        Arrival
                    </div>
                    <div className='ReservationModalData'>
                        { reservation.check_in.split('T')[0].split('-')[1] + '/' + reservation.check_in.split('T')[0].split('-')[2]}
                    </div>
                </Grid>
                <Grid item>
                    <div className='ReservationModalLabel'>
                        Departure
                    </div>
                    <div className='ReservationModalData'>
                        { reservation.check_out.split('T')[0].split('-')[1] + '/' + reservation.check_out.split('T')[0].split('-')[2]}
                    </div>
                </Grid>
                <Grid item>
                    <div className='ReservationModalLabel'>
                        # of Nights
                    </div>
                    <div className='ReservationModalData'>
                        { reservation.num_of_nights }
                    </div>
                </Grid>
            </Grid> */}
            
          </DialogContent>
          <DialogActions>
            {
                reservation.status == 'arriving' &&
                <Button 
                    onClick={handleClose}               
                    variant="contained"
                > Check In</Button>
            }
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default ReservationModal;