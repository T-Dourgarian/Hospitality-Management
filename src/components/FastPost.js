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
    const [invoiceTypes, setInvoiceTypes] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const handleSelectReservation = (event, value) => {
        setSelectedReservation(value);
    };
    const [selectedInvoiceType, setSelectedInvoiceType] = useState(null);
    const [selectedTxnType, setSelectedTxnTpe] = useState("");
    const [amount, setAmount] = useState(0);

    
    const inHouseReservations = useSelector(state => state.inHouseReservations.reservations);

    const handleTypeChange = (event, value) => {
        setSelectedTxnTpe(value);
    };
    const handleAmountChange = (event) => {
        setAmount(event.target.value);
      };
    const handleSelectInvoiceType = (event) => {
    setSelectedInvoiceType(event.target.value);
    };

     // { reservation_id, invoice_id, txns_type_id, amount }
    const handlePost = async() => {
        try {

            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/post`,
            {
                reservation_id: selectedReservation.reservation_id,
                invoice_type_id: selectedInvoiceType.id,
                txns_type_id: selectedTxnType.id,
                amount
            });

            

        } catch(error) {
            console.log(error);
        }
    }
    
    const fetchTxnTypes = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/types`);


            setTxnTypes(response.data);

        } catch(error) {
            console.log(error)
        }
    }

    const fetchInvoiceTypes = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/invoice/types`);

            setInvoiceTypes(response.data);

        } catch(error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchTxnTypes();
        fetchInvoiceTypes();
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
                        value={selectedTxnType || null}
                        onChange={handleTypeChange}
                        clearOnEscape
                        clearOnBlur
                    />
                }
            </Grid>

            <Grid item>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="invoice-type-select-label">Folio Type</InputLabel>
                    <Select
                        labelId="invoice-type-select-label"
                        id="invoice-type-select"
                        value={selectedInvoiceType || ''}
                        label="Invoice Type"
                        onChange={handleSelectInvoiceType}
                    >
                        {invoiceTypes.map((type) => (
                        <MenuItem key={type.id} value={type}>
                            {type.type}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

            <Grid item>
                <Button
                    variant="contained"
                    onClick={() => handlePost()}
                >
                    Post
                </Button>
            </Grid>



        </Grid>

    );
  }
  
  export default FastPost;