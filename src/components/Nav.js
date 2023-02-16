import './Nav.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; // Grid version 1
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import Arrivals from './Arrivals';
import React, { useState } from 'react';
import { Outlet, Link as RouterLink } from "react-router-dom";


// function goToArrivals() {
    
// } 

function Nav() {

    const [tabSelected, setTabSelected] = useState('')

  return (
    <div className="App">
        <Grid container direction="row" spacing={2}>
            <Grid item width="15%">
                <List>
                    {['arrivals'].map((text, index) => (
                        <ListItem 
                            key={index} 
                            disablePadding 
                            className="menuItem"
                        >
                            <ListItemButton
                                onClick={ () => setTabSelected('Arrivals') }
                                color="danger"
                                pl={3}
                                selected={tabSelected == 'Arrivals'}
                                component={RouterLink}
                                to={`/${text}`}
                            >
                                { text }
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item with="85%">
                <Outlet />
            </Grid>
        </Grid>
    </div>
  );
}

export default Nav;
