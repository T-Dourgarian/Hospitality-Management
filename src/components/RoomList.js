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

import { useTheme } from '@mui/material/styles';

import ReservationDialog from './ReservationDialog';

function RoomList() {

    const theme = useTheme();

    const [roomList, setRoomList] = useState(null);
    const [assignedReservations, setAssignedReservations] = useState(null);

    const [dateArray, setDateArray] = useState(() => {
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        function getDates(startDate, stopDate) {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push(new Date (currentDate));
                currentDate = currentDate.addDays(1);
            } 

            return dateArray;
        }

         
        let tempDate = new Date()
        tempDate.setDate(tempDate.getDate() + 10)
        return getDates(new Date(), tempDate);


    })

    useEffect(() => {

        const getRoomList = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/room/roomlist`);

                console.log(data);

                setRoomList(data);

            } catch (error) {
                console.log(error)
            }
        }

        const getAssignedReservations = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/room/assigned`);

                setAssignedReservations(data);

                console.log('assigned res', data);


            } catch (error) {
                console.log(error)
            }
        }


        getRoomList();
        getAssignedReservations();
        
    }, [])


    return (
    
            <Grid container pt={4} width="100%">
                {/* room list */}
                <Grid item xs={3}>
                    <Grid container direction="column" >
                        {/* header - room List */}
                        <Grid item>
                            <Grid 
                                container
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#EAEAEA'
                                }}
                                py={2}
                                pl={2}
                                justifyContent='space-between'
                            >
                                <Grid item xs={3}>
                                    #
                                </Grid>
                                <Grid item xs={4}>
                                    Type    
                                </Grid>
                                <Grid item xs={3}>
                                    Status    
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* body - room list */}
                        <Grid item>
                            {
                                roomList && roomList.map(room => (
                                    <Grid 
                                        key={room.id}
                                        container 
                                        justifyContent={'space-between'}
                                        pl={2}
                                        py={1}
                                        sx={{
                                            borderBottom: '1px solid black',
                                            borderRight: '1px solid black'
                                        }}
                                    >
                                        <Grid item xs={3}>
                                            { room.number }
                                        </Grid>
                                        <Grid item xs={4}>
                                            { room.name_short }    
                                        </Grid>
                                        <Grid item xs={3}>
                                            { room.status }    
                                        </Grid>
                                    </ Grid>
                                ))
                            }         
                        </Grid>
                    </Grid>
                </Grid>
                {/* reservations */}
                <Grid item xs={9}>
                     asdf           
                </Grid>
            </Grid>

    );
  }
  
  export default RoomList;