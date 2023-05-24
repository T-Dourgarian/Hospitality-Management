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



function ReservationDetails({ roomTypes }) {


    const [dialog, setDialog] = useState(false);

	const [formData, setFormData] = useState({
		lastName: '',
		firstName: '',
		email: '',
		phoneNumber: '',
		checkIn: dayjs(new Date()),
		checkOut: '',
		numberOfNights: '',
		roomType: '',
		adults: 1,
		children: 0,
	})


	const handleFormChange = (value, key) => {
		// console.log(value)
		setFormData({...formData, [key]: value})
	}
    


  return (
    <>
        <Button
            variant="contained"
            onClick={() => setDialog(true)}
        >
            <AddIcon />
            New Reservation											
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
                
                <DialogContent>

				  	<Grid container>
				  		<Grid item>
							<TextField
								label="Last Name"
								variant="outlined"
								value={formData.lastName}
								onChange={(e) => handleFormChange(e.target.value, 'lastName')}
							/>
						</Grid>
						<Grid item>
							<TextField
								label="First Name"
								variant="outlined"
								value={formData.firstName}
								onChange={(e) => handleFormChange(e.target.value, 'firstName')}
							/>
						</Grid>
						
						<Grid item>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker 
									label="Check In"
									value={formData.checkIn}
									onChange={(dateValue) => handleFormChange(dateValue, 'startDate')}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>


                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                        
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
    </>
  );
}

export default ReservationDetails;
