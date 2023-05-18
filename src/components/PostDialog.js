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
import { styled } from '@mui/system';

import ReservationTable from './ReservationsTable';
import ReservationDialog from './ReservationDialog';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { toggleDialog } from '../redux/txnDialogSlice';


import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
      backgroundColor: '#e8f1ff', // Set the background color on hover
      cursor: 'pointer', // Change the cursor to pointer on hover
    },
  }));



function PostDialog({ reservation_id, reservation, fetchReservationData }) { 

    const [invoices, setInvoices] = useState(reservation.invoices);
    const [selectedInvoice, setSelectedInvoice] = useState(reservation.invoices[0])
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionFormData, setTransactionFormData] = useState({
        id: null,
        type: null,
        amount: null
    });
    const [dialog, setDialog] = useState(false);
    
    const filterTransactions = () => {
        let txns = reservation.transactions.filter(txn => txn.f1.invoice_id === selectedInvoice.f1.id);

        txns.sort((a,b) => {
            return new Date(a.f1.created_at) - new Date(b.f1.created_at)
        })


        setTransactions(txns);

    };

    useEffect(() => {
        filterTransactions();
    },[selectedInvoice.f1.id])

    const dispatch = useDispatch();

    function toggleDialog(bool) {
        setDialog(bool)
    }


    const handleTransactionSelect = (txn) => {

        setTransactionFormData((prevData) => ({ 
            id: txn.f1.id,
            type: txn.f2.type,
            amount: txn.f1.amount
        }));

    }

    const totalPosted = () => {

        if (reservation.invoices) {
            const total = reservation.invoices.reduce(
                (accumulator, i) => accumulator + i.f1.total,
                0
              );
    

    
            return total;
        }

        return 0
    }

    const totalPaid = () => {

        if (reservation.invoices) {
            const total = reservation.invoices.reduce(
                (accumulator, i) => accumulator + i.f1.amount_paid,
                0
              );
    

    
            return total;
        }

        return 0
    }

    const handleSelectInvoice = (event) => {
        setSelectedInvoice(event.target.value);
    };


    useEffect(() => {
        console.log(invoices)
        if (reservation.transactions) {
            filterTransactions();
        }
    }, [])  

    
    useEffect(() => {
        if (!Object.is(invoices, reservation.invoices)) {
          setInvoices(reservation.invoices);
          setSelectedInvoice(reservation.invoices[0]);
        }
      }, [reservation.invoices]);
    
      useEffect(() => {
        if (!Object.is(transactions, reservation.transactions)) {
          filterTransactions();
        }
      }, [reservation.transactions]);


      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleClear = () => {
        setTransactionFormData({
            id: '',
            type: '',
            amount: ''
        });
      };

    return (
        <Box>
            
            <Button
                onClick={() => toggleDialog(true)}
                variant='contained'
                size='small'
            >
                Post
            </Button>

            <Dialog 
                open={dialog} 
                fullWidth
                maxWidth={'lg'}
                PaperProps={{
                    sx: {
                      height: '80%'
                    }
                }}
            >
                
                <DialogContent
                >
                    <Grid container direction='column' height='100%'>

                        <Grid item>
                            <Grid container > 
                                <Grid item xs={3}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="invoice-type-select-label">Folio Type</InputLabel>
                                        <Select
                                            labelId="invoice-type-select-label"
                                            id="invoice-type-select"
                                            value={selectedInvoice || ''}
                                            label="Invoice Type"
                                            onChange={handleSelectInvoice}
                                        >
                                            {invoices.map(invoice => (
                                            <MenuItem key={invoice.f1.id} value={invoice}>
                                                {invoice.f2.type}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3} pl={2}>
                                    <Box
                        
                                    >
                                        Total:
                                    </Box>
                                    <Box
                                        sx={{
                                            fontWeight:'bold'
                                        }}
                                    >
                                        ${ selectedInvoice.f1.total }
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Box>
                                        Remaining Balance:
                                    </Box>
                                    <Box
                                        sx={{
                                            fontWeight:'bold'
                                        }}
                                    >
                                        ${ selectedInvoice.f1.total -  selectedInvoice.f1.amount_paid }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid item>
                            <Card
                                variant="outlined"
                                sx={{
                                    maxHeight:'300px',
                                    overflowX:'hidden',
                                    overflowY:'scroll'
                                }}
                            >
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    id
                                                </TableCell>
                                                <TableCell>
                                                    Type
                                                </TableCell>
                                                <TableCell>
                                                    Amount
                                                </TableCell>
                                                <TableCell>
                                                    Created At
                                                </TableCell>
                                                <TableCell>
                                                    Tax Exempt
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                transactions[0] && transactions.map(txn => {
                                                    return (
                                                        <StyledTableRow key={txn.f1.id}
                                                            onClick={() => handleTransactionSelect(txn)}
                                                        >
                                                            <TableCell>
                                                                { txn.f1.id }
                                                            </TableCell>
                                                            <TableCell>
                                                                { txn.f2.type }
                                                            </TableCell>
                                                            <TableCell>
                                                                { txn.f1.amount }
                                                            </TableCell>
                                                            <TableCell>
                                                                { dayjs(txn.f1.created_at).format('MM/DD HH:mm') }
                                                            </TableCell>
                                                            <TableCell>
                                                                { txn.f2.tax_exempt + '' }
                                                            </TableCell>
                                                        </StyledTableRow>
                                                    )
                                                })
                                            }
                                        
                                            <TableRow
                                                
                                            >
                                                {/* <TableCell component="th" scope="row">
                                                    { i.f2.type }
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    { i.f1.total }
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    { i.f1.amount_paid}
                                                </TableCell> */}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>


                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleClear()}
                            >
                                New / Clear
                            </Button>

                            
                            <Grid container direction='column'>
                                <Grid item>
                                    <TextField
                                        disabled={true}
                                        name="id"
                                        label="ID"
                                        value={ transactionFormData.id || ''}
                                        variant="outlined"
                                        margin="normal"
                                        size='small'
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        name="type"
                                        label="Type"
                                        value={transactionFormData.type || ''}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        margin="normal"
                                        size='small'
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        name="amount"
                                        label="Amount"
                                        value={ transactionFormData.amount || ''}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        margin="normal"
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                       
                        </Grid>
                    </Grid>
                </DialogContent>
                    
                <DialogActions>
                    <Grid container justifyContent={'space-between'}>
                    
                        <Grid item px={2}>
                            <Button 
                                variant='outlined'
                                onClick={() => toggleDialog(false)}
                            >Close</Button>
                        </Grid>

                        {
                            selectedTransaction ?
                            <Grid item px={2}>
                                <Button 
                                    variant='outlined'
                                    onClick={() => toggleDialog(false)}
                                >Discount transaction</Button>
                            </Grid>:
                            <Grid item px={2}>
                                <Button 
                                    variant='outlined'
                                    onClick={() => toggleDialog(false)}
                                >Post Transaction</Button>
                            </Grid>
                        }

                       
                    </Grid>
                </DialogActions>
            </Dialog>
        </Box>
    );
  }
  
  export default PostDialog;