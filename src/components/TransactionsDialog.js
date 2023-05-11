import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Card,
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


import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';



function TransactionsDialog({ reservation_id, reservation }) { 

    const [invoices, setInvoices] = useState(reservation.invoices);
    const [transactions, setTransactions] = useState(reservation.transactions);
    const [dialog, setDialog] = useState(false);

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
        setInvoices(reservation.invoices);
        setTransactions(reservation.transactions);
        console.log(transactions)
    },[reservation_id])

    return (
        <Box>

            <Button
                onClick={() => setDialog(true)}
                variant='contained'
            >
                Details
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

                    <Grid container height='100%'>
                        {
                            invoices && invoices.map(i => 
                                <Grid item xs={6} key={i.f1.id} px={1} py={1} height='50%'
                                sx={{
                                            
                                    overflowX:'hidden',
                                    overflowY:'scroll'
                                }}
                                >
                                    <Card 
                                    >
                                        { i.f2.type}

                                        <TableContainer component={Paper}>
                                            <Table size="small" aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
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
                                onClick={() => setDialog(false)}
                            >Cancel</Button>
                        </Grid>

                       
                    </Grid>
                </DialogActions>
            </Dialog>
        </Box>
    );
  }
  
  export default TransactionsDialog;