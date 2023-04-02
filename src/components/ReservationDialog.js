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

import Notes from './Notes';
import AssignRoom from './AssignRoom';

function ReservationDialog({ reservation, getReservations, roomList, getRoomList, roomTypes, buttonText} ) {
    const [open, setOpen] = useState(false);
    const [checkInAlert, setCheckInAlert] = useState('');
    const [reservationLocal, setReservationLocal] = useState(reservation);
    const [updateMade, setUpdateMade] = useState(false);


    useEffect(( )=> {
      console.log('reservation', reservation)
    }, [])

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
      let checkIn = new Date(reservation.check_in);
      let today = new Date();

      return checkIn.toDateString() == today.toDateString() && reservation.status == 'reserved';
    };

    const isCheckOut = () => {
      let checkIn = new Date(reservation.check_out);
      let today = new Date();

      return checkIn.toDateString() == today.toDateString() && reservation.status == 'checked_in';
    }


    const handleCheckIn = async () => {
      try {

        let d = new Date();
        let currentTime = d.toLocaleTimeString();

        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/status/checkin`, {
          reservation_id: reservationLocal.reservation_id,
          checkInTime: currentTime
        })

        console.log('response',response);
        
      } catch (error) {
        console.log(error);
      }
    };

    const handleCheckOut = async () => {
      try {

        let d = new Date();
        let currentTime = d.toLocaleTimeString();

        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/status/checkout`, {
          reservation_id: reservationLocal.reservation_id,
          checkOutTime: currentTime
        })

        console.log('response',response);
        
      } catch (error) {
        console.log(error);
      }
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
          <DialogContent>
            <Grid container direction="row" spacing={6}>
              <Grid item xs={6}>
                <Grid container direction="column" spacing={3}>
                  <Grid 
                    item
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '20px'
                    }}  
                  >
                    {reservationLocal.last_name}, {reservationLocal.first_name}  - { reservationLocal.status.replace('_',' ') } - { reservation.reservation_id }

                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Grid 
                          container 
                          direction="column" 
                          spacing={1} 
                          pr={2}
                          borderRight={'1px solid black'}
                        >
                          <Grid item >
                            <div className='ReservationModalLabel'>
                                Arrival
                            </div>
                            <div className='ReservationModalData '>
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
                                  Room # { reservation.dnm &&  'DNM' }
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
                          <Grid item>
                              <div className='ReservationModalLabel'>
                                  Rate
                              </div>
                              <div className='ReservationModalData'>
                                  { reservationLocal.rate }
                              </div>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item >
                            <div className='ReservationModalLabel'>
                                Email
                            </div>
                            <div className='ReservationModalData '>
                                { reservationLocal.email}
                            </div>
                          </Grid>
                          <Grid item>
                              <div className='ReservationModalLabel'>
                                  Phone Number
                              </div>
                              <div className='ReservationModalData'>
                                  { reservationLocal.phone_number}
                              </div>
                          </Grid>
                          <Grid item>
                              <div className='ReservationModalLabel'>
                                  Street
                              </div>
                              <div className='ReservationModalData'>
                                  { reservationLocal.street_address }
                              </div>
                          </Grid>
                          <Grid item>
                              <div className='ReservationModalLabel'>
                                  state
                              </div>
                              <div className='ReservationModalData'>
                                  { reservationLocal.state}
                              </div>
                          </Grid>
                          <Grid item>
                              <div className='ReservationModalLabel'>
                                  zip
                              </div>
                              <div className='ReservationModalData'>
                                  { reservationLocal.zip_code }
                              </div>
                          </Grid>
                        </Grid>
                      </Grid>


                    </Grid>
                    <Grid item py={2}>
                      <Divider />
                    </Grid>
                    <Grid item>
                      <AssignRoom reservation={reservationLocal} setReservationLocal={setReservationLocal} setUpdateMade={setUpdateMade} roomList={roomList} getRoomList={getRoomList} roomTypes={roomTypes}/>
                    </Grid>
                    <Grid item py={2}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Notes notes={reservationLocal.notes} reservation_id={reservation.reservation_id}/>
              </Grid>              
            </Grid>

            
          </DialogContent>
          <DialogActions>
            <Grid container>
              
              
              {
                  isCheckIn(reservation) &&
                  <Button 
                      onClick={handleCheckIn}               
                      variant="contained"
                      disabled={!Number.isInteger(reservationLocal.room_number)}
                  > Check In</Button>
              }

              {
                  isCheckOut(reservation) &&
                  <Button 
                      onClick={handleCheckOut}               
                      variant="contained"
                  > Check Out</Button>
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