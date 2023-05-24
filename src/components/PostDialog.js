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
    const [selectedInvoice, setSelectedInvoice] = useState(reservation.invoices ? reservation.invoices[0] : null)
    const [transactions, setTransactions] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionFormData, setTransactionFormData] = useState({
        id: null,
        type: null,
        amount: null
    });
    const [txnTypes, setTxnTypes] = useState([])
    const [dialog, setDialog] = useState(false);
    
    const filterTransactions = () => {
        let txns = reservation.transactions.filter(txn => txn.f1.invoice_id === selectedInvoice.f1.id);

        // txns.sort((a,b) => {
        //     return new Date(a.f1.created_at) - new Date(b.f1.created_at)
        // })

        txns.sort((a,b) => {
            return new Date(b.f1.id) - new Date(a.f1.id)
        })


        setTransactions(txns);

    };

    const fetchTxnTypes = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/types`);
            setTxnTypes(response.data);

            console.log('txntypes', response.data);
            // console.log()

        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        filterTransactions();
    },[selectedInvoice.f1.id])

    // const dispatch = useDispatch();

    function toggleDialog(bool) {
        setDialog(bool)
    }


    const handleTransactionSelect = (txn) => {

        setTransactionFormData((prevData) => ({ 
            id: txn.f1.id,
            type: txn.f2,
            amount: txn.f1.amount * -1
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
        fetchTxnTypes();
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

      const handleSelectTransactionType = (event, value) => {
        setTransactionFormData((prevData) => ({ ...prevData, type: value }));
      }

      const handleClear = () => {
        setTransactionFormData({
            id: '',
            type: '',
            amount: ''
        });
      };

      const postNewTransaction = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/post`,
            {
                reservation_id,
                invoice_type_id: selectedInvoice.f2.id,
                txns_type_id: transactionFormData.type.id,
                amount: transactionFormData.amount
            });


            fetchReservationData();
        } catch(error) {
            console.log(error);
        }
      } 


    //   const { reservation_id, invoice_type_id, txns_type_id, txns_id, amount } = req.body;
      const discountTransaction = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/discount`,
            {
                reservation_id,
                invoice_type_id: selectedInvoice.f2.id,
                txns_type_id: transactionFormData.type.id,
                txns_id: transactionFormData.id,
                amount: transactionFormData.amount
            });

            console.log(response);


            fetchReservationData();
        } catch(error) {
            console.log(error);
        }
      }

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
                                                transactions && transactions.map(txn => {
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
                                
                                    {/* <TextField
                                        name="type"
                                        label="Type"
                                        value={transactionFormData.type || ''}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        margin="normal"
                                        size='small'
                                    /> */}
                                <Grid item pt={1}>
                                    {
                                        txnTypes[0] &&
                                        <Autocomplete
                                            options={txnTypes}
                                            getOptionLabel={(option) => option && option.type ? option.type : ''}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Transaction Type" variant="outlined" />
                                            )}
                                            isOptionEqualToValue={(option, value) => option.id === value.id || value === ''}
                                            value={transactionFormData.type || ''}
                                            onChange={handleSelectTransactionType}
                                            clearOnEscape
                                            clearOnBlur
                                            size="small"
                                            
                                        />
                                    }
                                </Grid>
                                
                                <Grid item>
                                    <TextField
                                        disabled={transactionFormData.id ? true : false}
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
                            transactionFormData.id ?
                            <Grid item px={2}>
                                <Button 
                                    variant='outlined'
                                    onClick={() => discountTransaction()}
                                >Discount transaction</Button>
                            </Grid>:
                            <Grid item px={2}>
                                <Button 
                                    variant='outlined'
                                    onClick={() => postNewTransaction()}
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