import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
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

import ReservationTable from './ReservationsTable';
import ReservationDialog from './ReservationDialog';

import { Routes, Route, useParams } from 'react-router-dom';

function FrontDesk() {


    const [value, setValue] = useState(0);

    const [arrivals, setArrivals] = useState([]);
    const [inHouse, setInHouse] = useState([]);
    const [departures, setDepartures] = useState([]);

    const [allFilteredReservations, setAllFilteredReservations] = useState([])
    const [filteredReservations, setFilteredReservations] = useState([]);

    const [selectedReservation, setSelectedReservation] = useState(null);

    let { reservation_id } = useParams();



    const [roomList, setRoomList] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    const [resFocus, setResFocus] = useState(null);


      const getArrivals = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/arrivals`);

        setArrivals(response.data)
      }

      const getInHouse = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/inhouse`);

        setInHouse(response.data)
      }

      const getDepartures = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/departures`);

        setDepartures(response.data)
      }

      const getRoomList = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/room/all`);
        setRoomList(response.data)
      }

      const getRoomTypeList = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/roomType`);
  
        setRoomTypes(response.data);
      }

      useEffect(() => {
        getArrivals();
        getInHouse();
        getDepartures();
        getRoomList();
        getRoomTypeList();
      },[])


      const filter = (search) => {

        setFilteredReservations(
          allFilteredReservations.filter(res => (
            res.last_name.toLowerCase().includes(search.toLowerCase()) ||
            `${res.reservation_id}`.includes(search)
          ))
        )
      }

      useEffect(() => {
        if (resFocus == 'arrivals') {
          setAllFilteredReservations(arrivals);
          setFilteredReservations(arrivals)
        } else if (resFocus == 'inHouse') {
          setAllFilteredReservations(inHouse)
          setFilteredReservations(inHouse)
        } else if (resFocus == 'departures' ) {
          setAllFilteredReservations(departures)
          setFilteredReservations(departures)
        }

      }, [resFocus])
      
  

    return (
        <Grid container direction="column" spacing={2} pt={2}>
            <Grid item >
            
              <TextField 
                id="outlined-basic" 
                label="In House" 
                variant="outlined" 
                onChange={(e) => filter(e.target.value)}
                onFocus={() => setResFocus('inHouse')}
                onBlur={() => setResFocus(null)}
              />


              {
                resFocus && <ReservationTable setFilteredReservations={setFilteredReservations} setResFocus={setResFocus} reservations={filteredReservations}/>
              }        

              <ReservationDialog reservation_id={reservation_id} roomList={roomList} getRoomList={getRoomList} roomTypes={roomTypes} />

            
            </Grid>
        </Grid>
    );
  }
  
  export default FrontDesk;