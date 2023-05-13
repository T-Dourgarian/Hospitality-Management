import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Card,
    Checkbox,
    Dialog,
    DialogContent,
    DialogActions,
    OutlinedInput,
    InputAdornment,
    InputLabel,
    IconButton,
    Radio,
    RadioGroup,
    FormLabel,
    FormControlLabel,
    FormControl,
    MenuItem,
    Paper,
    Select,
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

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { toggleDialog } from '../redux/txnDialogSlice';


import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';



function FastPost() { 

    const [txnTypes, setTxnTypes] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const handleSelectReservation = (event, value) => {
        setSelectedReservation(value);
    };
    const [selectedType, setSelectedType] = useState("");
    const [amount, setAmount] = useState(0);

    
    const inHouseReservations = useSelector(state => state.inHouseReservations.reservations);

    const handleTypeChange = (event, value) => {
      setSelectedType(value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
      };
    
    const fetchTxnTypes = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/types`);

            console.log(response.data)

            setTxnTypes(response.data);

        } catch(error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchTxnTypes();
    }, [])

    return (
        <Grid container direction="column" spacing={1} py={2} pr={2}>
            <Grid item>
                {
                    inHouseReservations && 
                    <Autocomplete
                        options={inHouseReservations}
                        getOptionLabel={(option) => `${option.room_number} - ${option.room_name}`}
                        value={selectedReservation}
                        onChange={handleSelectReservation}
                        renderInput={(params) => (
                            <TextField {...params} label="Search for a reservation" variant="outlined" />
                        )}
                    />
                }
            </Grid>

        
            <Grid item>
                {
                    txnTypes[0] &&
                    <Autocomplete
                        options={txnTypes}
                        getOptionLabel={(option) => option && option.type ? option.type : ''}
                        renderInput={(params) => (
                            <TextField {...params} label="Transaction Type" variant="outlined" />
                        )}
                        value={selectedType || null}
                        onChange={handleTypeChange}
                        clearOnEscape
                        clearOnBlur
                    />
                }
            </Grid>
            
            <Grid item>
                <TextField
                    label="Amount"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                />
            </Grid>



        </Grid>

    );
  }
  
  export default FastPost;