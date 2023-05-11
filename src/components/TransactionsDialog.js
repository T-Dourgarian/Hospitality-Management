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



function TransactionsDialog({ reservation_id, reservation, fetchReservationData }) { 

    const [invoices, setInvoices] = useState(reservation.invoices);
    const [transactions, setTransactions] = useState(reservation.transactions);
    const [selectedTransactions, setSelectedTransactions] = useState([]);


    const dispatch = useDispatch();
    function handleButtonClick(bool) {
        dispatch(toggleDialog(bool)); // sets txnDialog to true
    }
    

    const txnDialog = useSelector((state) => state.txnDialog.txnDialog);


    const transferTransactions = async (invoice_id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/transaction/transfer/${reservation_id}`, {
                txn_ids: selectedTransactions,
                invoice_id,
              })

              console.log(response);

              fetchReservationData();

              setSelectedTransactions([]);

        } catch(error) {
            console.log(error);
        }
    }

    const handleTransactionSelect = (checkedValue ,tx) => {

        if (selectedTransactions.includes(tx.f1.id)) {
            setSelectedTransactions(
                selectedTransactions.filter(tx1 => tx1 != tx.f1.id)
            )
        } else {
            setSelectedTransactions([...selectedTransactions, tx.f1.id])
        }

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


    useEffect(() => {
        if (!Object.is(invoices, reservation.invoices)) {
          setInvoices(reservation.invoices);
        }
      }, [reservation.invoices]);
    
      useEffect(() => {
        if (!Object.is(transactions, reservation.transactions)) {
          setTransactions(reservation.transactions);
        }
      }, [reservation.transactions]);
    

    useEffect(() => {
        setInvoices(reservation.invoices);
        setTransactions(reservation.transactions);
    },[reservation_id])

    return (
        <Box>
            
            <Button
                onClick={() => handleButtonClick(true)}
                variant='contained'
            >
                Details
            </Button>

            <Dialog 
                open={txnDialog} 
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
                    <Grid container height='100%'>
                        {
                            invoices && invoices.map((i, index) => 
                                <Grid item xs={6} key={i.f1.id} my={1} height='48%'
                                sx={{
                                    paddingLeft: index % 2 !== 0 ? '5px' : '0px',
                                    overflowX:'hidden',
                                    overflowY:'scroll'
                                }}
                                >
                                    <Card 
                                    
                                    >
                                        <Grid container justifyContent={'space-between'}>
                                            <Grid item>
                                                { i.f2.type}
                                            </Grid>
                                            <Grid item>
                                                <Button 
                                                    size="small"
                                                    variant="outlined"    
                                                    disabled={selectedTransactions.length == 0}
                                                    onClick={() => transferTransactions(i.f1.id)}
                                                >
                                                    Move Transactions here
                                                </Button>
                                            </Grid>
                                        </Grid>



                                        <TableContainer component={Paper}>
                                            <Table size="small" aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Select</TableCell>
                                                        <TableCell>Type</TableCell>
                                                        <TableCell>amount ($)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {
                                                    transactions && transactions.filter(t => t.f1.invoice_id == i.f1.id).map(t => 
                                                        <TableRow
                                                            key={t.f1.id}
                                                            hover
                                                            // onClick={() => handleSelectAdditional(a)}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                <Checkbox
                                                                    checked={selectedTransactions.includes(t.f1.id)}
                                                                    onChange={(e) => handleTransactionSelect(e.target.checked, t)}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                { t.f2.type }
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                { t.f1.amount }
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Card>
                                </Grid>
                            )
                        }
                    </Grid>
                </DialogContent>
                    
                <DialogActions>
                    <Grid container justifyContent={'space-between'}>
                    
                        <Grid item px={2}>
                            <Button 
                                variant='outlined'
                                onClick={() => handleButtonClick(false)}
                            >Cancel</Button>
                        </Grid>

                       
                    </Grid>
                </DialogActions>
            </Dialog>
        </Box>
    );
  }
  
  export default TransactionsDialog;