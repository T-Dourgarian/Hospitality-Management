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

function FrontDesk() {


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
            <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                      <Tab label="Room List" />
                      <Tab label="Room Type Forcast" />
                    </Tabs>
                </Box >
                <TabPanel value={value} index={0}>
                    <RoomList />                    
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <RoomTypeForcast />                    
                </TabPanel>
            </Grid>
        </Grid>
    );
  }
  
  export default FrontDesk;