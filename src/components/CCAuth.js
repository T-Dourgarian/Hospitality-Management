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
    MenuItem,
    Paper,
    TableRow,
    TableHead,
    InputAdornment,
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
import dayjs from 'dayjs';

// guest_id, reservation_id, cardHolderName, cardNumber, expiration_date, amount, notes
function CCAuth({ reservation, authorizations, fetchReservationData, amount }) {

    const [notes, setNotes] = useState(null);
    const [ccInfo, setCCInfo] = useState({
        name: '',
        number: '',
        expMM: '',
        expYY: '',
        amount: amount ? amount : 1,
        notes: ''
    })
    const [localAuthorizations, setLocalAuthorizations] = useState(authorizations);

    const [years] = useState(() => {
        const years = [];
        let year = dayjs().year();

        for (let i = 0; i < 10; i++) {
            years.push(year);
            year++;
        }

        return years
    })

    const cardNumberInput = (e) => {
        const { value } = e.target;

        setCCInfo(prev => ({
            ...prev,
            number: value.replace(/\D/g, "")
        }))
    }

    const cardExpInput = (e) => {
        const inputValue = e.target.value;
        const name = e.target.name;


        console.log(String(inputValue).slice(-2))

        setCCInfo(prev => ({
            ...prev,
            [name]: inputValue
        }))
    }
    
    const nameInput = (e) => {
        const { value } = e.target;

        setCCInfo(prev => ({
            ...prev,
            name: value.replace(/\d/g, "")
        }))
    }

    const amountInput = (e) => {
        const { value } = e.target;

        setCCInfo(prev => ({
            ...prev,
            amount: value.replace(/[^$.\d]/g, "")
        }))
    }

    const amountBlur = () => {
        setCCInfo(prev => ({
            ...prev,
            amount: Number(ccInfo.amount) ? Number(ccInfo.amount).toFixed(2) : ''
        }))
    }

    const notesInput = (e) => {
        const { value } = e.target;

        setCCInfo(prev => ({
            ...prev,
            notes: value
        }))
    }

    // const { reservation_id, cardHolderName, cardNumber, expiration_date, amount, notes } = req.body;
    const handleAuthorization = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/ccauth/new`,
            {   
                reservation_id: reservation.reservation_id,
                cardHolderName: ccInfo.name,
                cardNumber: ccInfo.number,
                expiration_date: ccInfo.expMM + '/' + ccInfo.expYY,
                amount: ccInfo.amount,
                notes: ccInfo.notes
            });

            
            const { status } = response.data;
            
            if (status === 'success') {
                console.log(status);
            } else {
                console.log(status);
            }

            fetchReservationData();
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!Object.is(authorizations, localAuthorizations)) {
            
            if (authorizations) {
                setLocalAuthorizations(authorizations);
            }

        }
      }, [authorizations]);

    useEffect(() => {

       

    }, []);


    return (

            <Grid direction='column' container spacing={1}>
                <Grid item>
                    <TextField
                        label="Card Number"
                        variant="outlined"
                        size="small"
                        value={ccInfo.number}
                        name="number"
                        onChange={cardNumberInput}
                        inputProps={{
                            maxLength: 16, // Maximum length of the card number
                            pattern: "([^0-9]*)" // Only allow numeric input
                        }}
                    />

                </Grid>

                <Grid item>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <TextField
                                select
                                label="Month"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="expMM"
                                value={ccInfo.expMM}
                                onChange={cardExpInput}
                            >
                                <MenuItem value="">Month</MenuItem>
                                <MenuItem value="01">01</MenuItem>
                                <MenuItem value="02">02</MenuItem>
                                <MenuItem value="03">03</MenuItem>
                                <MenuItem value="04">04</MenuItem>
                                <MenuItem value="05">05</MenuItem>
                                <MenuItem value="06">06</MenuItem>
                                <MenuItem value="07">07</MenuItem>
                                <MenuItem value="08">08</MenuItem>
                                <MenuItem value="09">09</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Year"
                                variant="outlined"
                                value={ccInfo.expYY}
                                name="expYY"
                                onChange={cardExpInput}
                            >
                                <MenuItem value="" disabled={true}>Year</MenuItem>
                                {
                                    years[0] && years.map(y => 
                                        <MenuItem key={y} value={ String(y).slice(-2)} >{ y }</MenuItem>
                                    )
                                }
                            </TextField>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item>
                    <TextField
                        label="Card Holder Name"
                        variant="outlined"
                        size="small"
                        value={ccInfo.name}
                        onChange={nameInput}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        onBlur={amountBlur}
                        label="Authorization Amount"
                        variant="outlined"
                        size="small"
                        value={ccInfo.amount}
                        onChange={amountInput}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Notes"
                        sx={{
                            width: '35% !important'
                        }}
                        variant="outlined"
                        size="small"
                        value={ccInfo.notes}
                        onChange={notesInput}
                        multiline
 
                    />
                </Grid>

                <Grid item>
                <Button
                    onClick={handleAuthorization}
                    variant='contained'
                >
                    Authorize
                    </Button>
                </Grid>


                <Grid item>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Card Number</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                localAuthorizations && localAuthorizations.map(a => 
                                    <TableRow
                                        key={a.id}
                                        hover
                                        // onClick={() => handleSelectAdditional(a)}
                                    >
                                        <TableCell component="th" scope="row">
                                            { dayjs(a.created_at).format('MM/DD/YYYY HH:mm') }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.authorization_amount}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.status}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.card_number }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.notes }
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

            </Grid>

    );
  }
  
  export default CCAuth;