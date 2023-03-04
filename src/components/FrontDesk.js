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

import Arrivals from './Arrivals';
import Departures from './Departures';
import InHouse from './InHouse';

function FrontDesk() {

    // const [arrivals, setArrivals] = useState([]);


    // useEffect(() => {
    //     const getArrivals = async () => {
    //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/arrivals`);

    //       setArrivals(response.data)
    //     }

    //     getArrivals();

    // },[])

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box >
                { children }
              </Box>
            )}
          </div>
        );
      }
      
  

    return (
        <Grid container direction="column" spacing={2} pt={2}>
            <Grid item width="100%">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Arrivals" />
                    <Tab label="In House" />
                    <Tab label="Departures"  />
                    </Tabs>
                </Box >
                <TabPanel value={value} index={0}>
                    <Arrivals />                    
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <InHouse />
                </TabPanel>
                <TabPanel value={value} index={2}>
                   <Departures />
                </TabPanel>
            </Grid>
        </Grid>
    );
  }
  
  export default FrontDesk;