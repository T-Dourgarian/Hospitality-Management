import './Nav.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; // Grid version 1
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import Link from '@mui/material/Link';
import { ListItemText, Collapse, ListItemIcon, InboxIcon } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Outlet, Link as RouterLink } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchReservations } from '../redux/InHouseReservationsSlice';


function Nav() {

    const [tabSelected, setTabSelected] = useState('');

    const [open, setOpen] = React.useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchReservations());
    }, [dispatch]);


  return (
    <div className="App">
        <Grid container direction="row" spacing={2}>
            <Grid item xs={2} borderRight={'1px solid grey '} height={'100vh'}>
                <List>
                    {['Front Desk', 'Room Management', 'Fast Post'].map((text, index) => (
                        <ListItem 
                            key={index} 
                            disablePadding 
                            className="menuItem"
                        >
                            <ListItemButton
                                onClick={ () => setTabSelected(text) }
                                color="danger"
                                pl={3}
                                selected={tabSelected == text}
                                component={RouterLink}
                                to={`/${text.replaceAll(' ','').toLowerCase()}`}
                            >
                                { text }
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={10}>
                <Outlet />
            </Grid>
        </Grid>
    </div>
  );
}

export default Nav;
