import './Nav.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; // Grid version 1
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import Arrivals from './Arrivals';
import React, { useState } from 'react';


// function goToArrivals() {
    
// } 

function Nav() {

    const [tab, setTab] = useState('asdf');

  return (
    <div className="App">
        <Grid container direction="row" spacing={2}>
            <Grid item width="10%">
                <List>
                    {['Arrivals'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => setTab('Arrivals')}
                            >
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item with="90%">
                    {
                        tab == 'Arrivals' &&
                        <Arrivals />
                    }
            </Grid>
        </Grid>
    </div>
  );
}

export default Nav;
