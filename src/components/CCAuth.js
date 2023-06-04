import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Card,
    Chip,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
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
import AddIcon from '@mui/icons-material/Add';

// guest_id, reservation_id, cardHolderName, cardNumber, expiration_date, amount, notes
function CCAuth({ reservation, reservation_id, guest_id, amount }) {

    const [notes, setNotes] = useState(null);
    const [ccInfo, setCCInfo] = useState({
        name: '',
        number: '',
        expDate: '',
        amount: amount ? amount : 0,
        notes: ''
    })

    useEffect(() => {

       

    }, []);


  

    return (
        <Grid container direction="column" py={1}>
            <Card>
                Hello
                   
            </Card>
        </ Grid>
    );
  }
  
  export default CCAuth;