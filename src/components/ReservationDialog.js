import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationDialog.css'
import MMDD from '../utils/formatDate';
import { 
    Button,
    Box,
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
import Additionals from './Additionals';
import FolioSummary from './FolioSummary';
import StayDetails from './StayDetails';

function ReservationDialog({ reservation_id, roomList, getRoomList, roomTypes } ) {
    const [open, setOpen] = useState(false);
    const [checkInAlert, setCheckInAlert] = useState('');
    const [updateMade, setUpdateMade] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [reservationLocal, setReservationLocal] = useState(null);


    const fetchReservationData = async () => {
      try {
        if (reservation_id) {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/single/${reservation_id}`);

          setReservation(response.data);
          setReservationLocal(response.data)


        }
      } catch(error) {
        console.log(error);
      }
    }

    
    useEffect(() => {
      fetchReservationData();
    }, [reservation_id])
  

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


        
      } catch (error) {
        console.log(error);
      }
    }

     
    return (
      <Box>
          {
            reservation && 
            <>
            <Grid container direction="row" spacing={6} pr={1} pt={1}>
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
                <Grid container  direction="column">
                  <Grid item >
                    <FolioSummary reservation={reservationLocal} reservation_id={reservationLocal.reservation_id} fetchReservationData={fetchReservationData}/>
                  </Grid>
                  <Grid item pb={1}>
                    <Notes notes={reservationLocal.notes} reservation_id={reservationLocal.reservation_id}/>
                  </Grid>

                
                  <Grid item >
                    <Additionals reservation={reservationLocal} additionals={reservationLocal.additionals} reservation_id={reservationLocal.reservation_id}/>
                  </Grid>

                  <Grid item>
                    <StayDetails stay_details={reservationLocal.stay_details} reservation_id={reservationLocal.reservation_id} fetchReservationData={fetchReservationData}/>
                  </Grid>

                </Grid>
              
              </Grid>       
            </Grid>

            
          
          
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

              {
                <Typography>
                  { checkInAlert }
                </Typography>
              }
            </Grid>
            </>
          }
      </Box>
    );
  }
  
  export default ReservationDialog;