import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationDialog.css'
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
    InputLabel,
    Card,
    Collapse,
    Divider
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';

import RoomList from './RoomList';

function ReservationDialog({ reservation, getArrivals,  buttonText} ) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const isCheckIn = (reservation) => {
      let checkIn = new Date(reservation.check_in);
      let today = new Date();

      return checkIn.toDateString() == today.toDateString() && reservation.status == 'reserved';
    }
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          {buttonText}
        </Button>
        <Dialog open={open} keepMounted fullScreen>
          <DialogTitle> {reservation.last_name}, {reservation.first_name} </DialogTitle>
          <DialogContent>
            {/* <Grid container direction="row" >
                <Input id="component-disabled" defaultValue={reservation.last_name} />
            </Grid> */}
            <Grid container direction="row" spacing={6}>
              <Grid item>
                <Grid container direction="column" >
                  <Grid item>
                    <Grid container direction="row" spacing={12}>
                        <Grid item >
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
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              Room
                          </div>
                          <div className='ReservationModalData'>
                              { reservation.room_number ? reservation.room_number : 'Unassigned' }
                          </div>
                      </Grid>
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              Room Type
                          </div>
                          <div className='ReservationModalData'>
                              { reservation.name_short }
                          </div>
                      </Grid>
                    </Grid>
                    <Grid item py={2}>
                      <Divider />
                    </Grid>
                    <Grid item>
                      <RoomList reservation={reservation} getArrivals={getArrivals}/>
                    </Grid>
                    <Grid item py={2}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              
            </Grid>
            
          </DialogContent>
          <DialogActions>
            <Grid container>
              
              
              {
                  reservation.status == 'reserved' && isCheckIn(reservation) &&
                  <Button 
                      onClick={handleClose}               
                      variant="contained"
                  > Check In</Button>
              }
              <Button onClick={handleClose}>Cancel</Button>
            </Grid>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default ReservationDialog;