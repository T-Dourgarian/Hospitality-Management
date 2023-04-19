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



function Additionals({ additionals, reservation_id, reservation }) { 

    const [localAdditionals, setLocalAdditionals] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [additionalTypes, setAdditionalTypes] = useState(null);
    const [type, setType] = useState('');
    const [rate, setRate] = useState('')
    const [folio, setFolio] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const check_in = new Date(reservation.check_in)
        const today = new Date();

        if (check_in < today) {
            return dayjs(today)
        }

        return dayjs(check_in);
    });
    const [endDate, setEndDate] = useState(dayjs(reservation.check_out));
    const [updateMode, setUpdateMode] = useState(false);
    const [selectedAdditional, setSelectedAdditional] = useState('');


    const handleSelectAdditional = (a) => {

        setUpdateMode(true);
        setSelectedAdditional(a.f1);
        setType(a.f2.id)
        setRate(a.f1.price)
        setStartDate(dayjs(a.f1.start_date))
        setEndDate(dayjs(a.f1.end_date));
        setFolio(a.f3.invoice_type_id)
    }


    const saveAdditional = async () => {
        
    }

    const handleTypeSelect = (e) => {
        setType(e.target.value);

        setRate(additionalTypes.find(at => at.id == e.target.value).rate)
    }



    const fetchAdditionalTypes = async() => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/additional/types`);

            console.log(response.data)

            setAdditionalTypes(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    const createDialogToggle = () => {
        setCreateDialog(!createDialog);
    }

    const numberOfNights = (date1, date2) => {
        let start = new Date(date1);
        let end = new Date(date2);
        let timeDiff = Math.abs(end.getTime() - start.getTime());
        let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        return numberOfNights

    }


    useEffect(() => {
        fetchAdditionalTypes();
        setLocalAdditionals(additionals);
    },[reservation_id])

    return (
        <Box>

            <Grid container direction="column">
                <Grid item>
                    <Grid container justifyContent={'space-between'} pb={1} alignItems="center" >
                        <Grid item>
                            Additionals
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                // onClick={createDialogToggle}
                                sx={{ zIndex: '0 !important'}}
                                size="small"
                                onClick={createDialogToggle}
                            >
                                <AddIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Card
                        variant="outlined"
                        sx={{
                            height:'150px',
                            overflowX:'hidden',
                            overflowY:'scroll'
                        }}
                    >
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Total Posts</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    localAdditionals && localAdditionals.map(a => 
                                        <TableRow
                                            key={a.f1.id}
                                        >
                                            <TableCell component="th" scope="row">
                                                { a.f2.name }
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                { a.f1.price }
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                { a.f1.start_date.split('T')[0] }
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                { a.f1.end_date.split('T')[0] }
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                { numberOfNights(a.f1.start_date, a.f1.end_date) }
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>


            <Dialog 
                open={createDialog} 
                onClose={createDialogToggle}
                fullWidth
            >
                
                <DialogContent >
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Total Posts</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                localAdditionals && localAdditionals.map(a => 
                                    <TableRow
                                        key={a.f1.id}
                                        hover
                                        onClick={() => handleSelectAdditional(a)}
                                    >
                                        <TableCell component="th" scope="row">
                                            { a.f2.name }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.f1.price }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.f1.start_date.split('T')[0] }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { a.f1.end_date.split('T')[0] }
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            { numberOfNights(a.f1.start_date, a.f1.end_date) }
                                        </TableCell>
                                        <TableCell component="th" scope="row">

                                            <IconButton>
                                                <DeleteIcon sx={{color: 'red !important'}} onClick={() => console.log('sdf')}/>
                                            </IconButton>
                                                
                                            
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <Grid container justifyContent={'space-between'} alignItems={'center'}  sx={{ fontSize: '17px !important', fontWeight: 'bold', height:'50px'}}>
                        <Grid item>
                            {
                                updateMode ? 
                                'Update Additional':
                                'New Additional'
                            }
                        </Grid>
                        {
                            updateMode &&
                            <Grid item>
                                <Button
                                    variant='contained'
                                    size="small"
                                    onClick={() => setUpdateMode(false)}
                                >New -{'>'}</Button>
                            </Grid>
                        }
                    </Grid>

                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    disabled={updateMode}
                                    id="demo-simple-select"
                                    value={type}
                                    label="Age"
                                    onChange={(e) => handleTypeSelect(e)}
                                    >
                                    {
                                        additionalTypes && additionalTypes.map(a => <MenuItem key={a.id} value={a.id}> { a.name } </MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <FormControl fullWidth >
                                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Amount"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                />
                            </FormControl>
                        </Grid>


                        <Grid item>
                            <Grid container justifyContent={'space-between'}>
                                <Grid>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker 
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(newValue) => setStartDate(newValue)}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker 
                                            label="End Date"
                                            value={endDate}
                                            onChange={(newValue) => setEndDate(newValue)}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                        </Grid>


                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Folio</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    disabled={updateMode}
                                    id="demo-simple-select"
                                    value={folio}
                                    label="Folio"
                                    onChange={(e) => setFolio(e.target.value)}
                                    >
                                    {
                                        reservation.invoices && reservation.invoices.map(i => <MenuItem key={i.f2.id} value={i.f2.id}> { i.f2.type } </MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>


                    </Grid>
                    
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent={'space-between'}>
                    
                        <Grid item px={2}>
                            <Button 
                                variant='outlined'
                                onClick={createDialogToggle}
                            >Cancel</Button>
                        </Grid>

                        <Grid item px={2}>
                            {
                                updateMode ?
                                <Button 
                                    variant='contained'
                                    onClick={saveAdditional}
                                >save</Button>:
                                <Button 
                                    variant='contained'
                                    onClick={saveAdditional}
                                >Add</Button>
                            }
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            
        </Box>
    );
  }
  
  export default Additionals;