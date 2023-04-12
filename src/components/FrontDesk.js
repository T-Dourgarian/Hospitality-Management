import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Radio,
    RadioGroup,
    FormLabel,
    FormControlLabel,
    FormControl,
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
    const [allFilteredReservations, setAllFilteredReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [resFocus, setResFocus] = useState('inHouse');
    const [showTable, setShowTable] = useState(false);
    
    let { reservation_id } = useParams();

      const getArrivals = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/arrivals`);

        setArrivals(response.data)
      }

      const getInHouse = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/list/inhouse`);

        setInHouse(response.data)
        setFilteredReservations(response.data)
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
          setFilteredReservations(arrivals);
        } else if (resFocus == 'inHouse') {
          setAllFilteredReservations(inHouse)
          setFilteredReservations(inHouse);
        } else if (resFocus == 'departures' ) {
          setAllFilteredReservations(departures)
          setFilteredReservations(departures);
        }

      }, [resFocus])
      


    return (
        <Grid container direction="column" spacing={2} pt={2}>
            <Grid 
              item 
            >


              <Grid 
                container
                alignItems="center"
                sx={{
                  padding: '0 0 10px 0'
                }}
              >
                
                  <Grid item>
                    <TextField 
                      id="outlined-basic" 
                      label="Search" 
                      variant="outlined" 
                      onChange={(e) => filter(e.target.value)}
                      onFocus={() => setShowTable(true)}
                      onBlur={() => setShowTable(false)}
                    />
                  </Grid>


                  <Grid item pl={2}>
                    <FormControl>
                      <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          value={resFocus}
                          onChange={(e) => setResFocus(e.target.value)}
                          name="radio-buttons-group"
                          row
                      >
                          <FormControlLabel value="arrivals" control={<Radio />} label="Arrivals" />
                          <FormControlLabel value="inHouse" control={<Radio />} label="In House" />
                          <FormControlLabel value="departures" control={<Radio />} label="Departures" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
              </Grid>


              {
                showTable && <ReservationTable setFilteredReservations={setFilteredReservations} setShowTable={setShowTable} reservations={filteredReservations}/>
              }        

              <ReservationDialog reservation_id={reservation_id} roomList={roomList} getRoomList={getRoomList} roomTypes={roomTypes} />

            
            </Grid>
        </Grid>
    );
  }
  
  export default FrontDesk;