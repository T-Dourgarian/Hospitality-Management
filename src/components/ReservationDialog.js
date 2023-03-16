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
    Divider,
    Typography
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';

import RoomList from './RoomList';

function ReservationDialog({ reservation, getReservations, roomList, getRoomList, roomTypes, buttonText} ) {
    const [open, setOpen] = useState(false);
    const [checkInAlert, setCheckInAlert] = useState('');
    const [reservationLocal, setReservationLocal] = useState(reservation);
    const [updateMade, setUpdateMade] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);

      if (updateMade) {
        getReservations();
        getRoomList();
      }
    };

    const isCheckIn = (reservation) => {
      let checkIn = new Date(reservationLocal.check_in);
      let today = new Date();

      return checkIn.toDateString() == today.toDateString() && reservationLocal.status == 'reserved';
    };


    const handleCheckIn = async () => {
      try {

        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/status/checkin`, {
          reservation_id: reservationLocal.reservation_id
        })

        console.log('response',response);
        
      } catch (error) {
        console.log(error);
      }
    };

    const handleDialogClose = () => {
      console.log('here');
    }
     
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          {buttonText}
        </Button>
        <Dialog 
          open={open} 
          fullScreen
        >
          <DialogTitle> {reservationLocal.last_name}, {reservationLocal.first_name} </DialogTitle>
          <DialogContent>
            {/* <Grid container direction="row" >
                <Input id="component-disabled" defaultValue={reservationLocal.last_name} />
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
                              { reservationLocal.check_in.split('T')[0].split('-')[1] + '/' + reservationLocal.check_in.split('T')[0].split('-')[2]}
                          </div>
                      </Grid>
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              Departure
                          </div>
                          <div className='ReservationModalData'>
                              { reservationLocal.check_out.split('T')[0].split('-')[1] + '/' + reservationLocal.check_out.split('T')[0].split('-')[2]}
                          </div>
                      </Grid>
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              # of Nights
                          </div>
                          <div className='ReservationModalData'>
                              { reservationLocal.num_of_nights }
                          </div>
                      </Grid>
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              Room
                          </div>
                          <div className='ReservationModalData'>
                              { reservationLocal.room_number ? reservationLocal.room_number : 'Unassigned' }
                          </div>
                      </Grid>
                      <Grid item>
                          <div className='ReservationModalLabel'>
                              Room Type
                          </div>
                          <div className='ReservationModalData'>
                              { reservationLocal.name_short }
                          </div>
                      </Grid>
                    </Grid>
                    <Grid item py={2}>
                      <Divider />
                    </Grid>
                    <Grid item>
                      <RoomList reservation={reservationLocal} setReservationLocal={setReservationLocal} setUpdateMade={setUpdateMade} roomList={roomList} getRoomList={getRoomList} roomTypes={roomTypes}/>
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
                  reservationLocal.status == 'reserved' && isCheckIn(reservation) &&
                  <Button 
                      onClick={handleCheckIn}               
                      variant="contained"
                  > Check In</Button>
              }
              <Button onClick={handleClose}>Cancel</Button>

              {
                <Typography>
                  { checkInAlert }
                </Typography>
              }
            </Grid>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default ReservationDialog;