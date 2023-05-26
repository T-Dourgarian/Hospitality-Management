import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios, { formToJSON } from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Card,
    Checkbox,
	Chip,
    Dialog,
    DialogContent,
    DialogActions,
	Divider,
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
import numberOfNights from '../utils/numberOfNights';

const validateEmail = (value) => {
	if (value) {
		// Simple email validation regex pattern
		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return emailRegex.test(value);
	} 

	return true;
};

const validatePhoneNumber = (value) => {
	if (value) {
		// Remove any non-digit characters from the input
		const digitsOnly = value.replace(/\D/g, '');

		// Phone number validation regex pattern
		const phoneNumberRegex = /^\d{10}$/; // Assumes 10-digit phone number format
		return phoneNumberRegex.test(digitsOnly);
	} 

	return true;
};


function ReservationDetails({ roomTypes }) {


	const [today] = useState(new Date());
    const [dialog, setDialog] = useState(false);
	const [formData, setFormData] = useState({
		lastName: '',
		firstName: '',
		email: '',
		phoneNumber: '',
		checkIn: dayjs(today),
		checkOut: '',
		numberOfNights: '',
		roomType: '',
		adults: 1,
		children: 0,
		note: ''
	})
	const [displayRoomTypes, setDisplayRoomTypes] = useState([])

	const isEmailValid = validateEmail(formData.email);
	const isPhoneNumberValid = validatePhoneNumber(formData.phoneNumber);

	const handleFormChange = (value, key) => {
		
		setFormData({...formData, [key]: value})
	}

	const handle = (e, value) => {
		setDisplayRoomTypes(value)
	}
    

	useEffect(() => {

		if (formData.checkIn && formData.numberOfNights ) {
			console.log('here')
			setFormData(
				{
					...formData,
					checkOut: dayjs(formData.checkIn).add(formData.numberOfNights, 'days')
				}
			)
		}
	}, [formData.numberOfNights])


	useEffect(() => {

		if (formData.checkIn && formData.checkOut) {
			setFormData(
				{
					...formData,
					numberOfNights: numberOfNights(formData.checkIn, formData.checkOut)
				}
			)
		}
	}, [formData.checkOut])

	useEffect(() => {
		if (formData.checkIn && formData.numberOfNights && formData.checkOut) {
			setFormData(
				{
					...formData,
					numberOfNights: formData.checkOut.diff(formData.checkIn, 'days'),
				}
			)
		}
	}, [formData.checkIn])


	useEffect(() => {
		console.log('roomTypes', roomTypes)
	}, [roomTypes])

	const handleRoomType = (event) => {
		const {
		  target: { value },
		} = event;

		setDisplayRoomTypes(
		  // On autofill we get a stringified value.
		  typeof value.name_short === Object ? value.split(',') : value,
		);
	  };

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
                      height: '90%'
                    }
                  }}
            >
                
                <DialogContent>

				  	<Grid container>
				  		<Grid 
							item 
							xs={3}
							pr={1}
							sx={{
								borderRight:'1px solid grey'
							}}
						>
							<Grid container direction="column" >
								<Grid item my={1}>
									< LocalizationProvider dateAdapter={AdapterDayjs}>
										<DatePicker 
											label="Check In"
											value={formData.checkIn}
											onChange={(dateValue) => handleFormChange(dateValue, 'checkIn')}
											sx={{
												width:'100%'
											}}
										/>
									</LocalizationProvider>
								</Grid>

								<Grid item my={1}>
									<TextField
										type="integer"
										label="Number of Nights"
										fullWidth={true}
										variant="outlined"
										size="small"
										value={formData.numberOfNights}
										onChange={(e) => handleFormChange(e.target.value, 'numberOfNights')}
									/>
								</Grid>
								

								<Grid item my={1}>
									< LocalizationProvider dateAdapter={AdapterDayjs}>
										<DatePicker 
											label="Check Out"
											value={formData.checkOut}
											minDate={formData.checkIn.add(1,'day')}
											onChange={(dateValue) => handleFormChange(dateValue, 'checkOut')}
											sx={{
												width:'100%'
											}}
										/>
									</LocalizationProvider>
								</Grid>

								< Divider/>

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										label="Last Name"
										variant="outlined"
										size="small"
										value={formData.lastName}
										onChange={(e) => handleFormChange(e.target.value, 'lastName')}
									/>
								</Grid>
								<Grid item my={1}>
									<TextField
										fullWidth={true}
										label="First Name"
										variant="outlined"
										size="small"
										value={formData.firstName}
										onChange={(e) => handleFormChange(e.target.value, 'firstName')}
									/>
								</Grid>

								< Divider />

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										type="integer"
										label="Number of Adults"
										variant="outlined"
										size="small"
										value={formData.adults}
										onChange={(e) => handleFormChange(e.target.value, 'adults')}
									/>
								</Grid>

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										type="integer"
										label="Number of Children"
										variant="outlined"
										size="small"
										value={formData.children}
										onChange={(e) => handleFormChange(e.target.value, 'children')}
									/>
								</Grid>

								< Divider/>

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										type={"email"}
										label="Email"
										variant="outlined"
										size="small"
										value={formData.email}
										error={!isEmailValid}
										helperText={!isEmailValid ? 'Invalid email address' : ''}
										onChange={(e) => handleFormChange(e.target.value, 'email')}
									/>
								</Grid>

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										label="Phone Number"
										variant="outlined"
										size="small"
										value={formData.phoneNumber}
										error={!isPhoneNumberValid}
										helperText={!isPhoneNumberValid ? 'Invalid Phone Number' : ''}
										onChange={(e) => handleFormChange(e.target.value, 'phoneNumber')}
									/>
								</Grid>

								<Grid item my={1}>
									<TextField
										fullWidth={true}
										label="Note"
										variant="outlined"
										multiline
										rows={4}
										value={formData.note}
										onChange={(e) => handleFormChange(e.target.value, 'note')}
									/>
								</Grid>
							</Grid>
						</Grid>


						<Grid item xs={9} pt={1} pl={1}>
							<Grid container direction='column' alignItems={'stretch'} >
								<Grid item >
									{/* <FormControl fullWidth>
										<InputLabel id="RoomType">Room Type</InputLabel>
										<Select
											labelId="RoomType"
											id="RoomType"
											value={displayRoomTypes}
											label="Room Type"
											onChange={handleRoomType}
											input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
											renderValue={(selected) => (
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
												  {selected.map((value) => (
													<Chip key={value.id} label={value.name_short} />
												  ))}
												</Box>
											)}
										>
											{
												roomTypes && roomTypes.map(rt => 
													<MenuItem 
														key={rt.id}
														value={rt}
													>
														{ rt.name_short }
													</MenuItem>
												)
											}
										</Select>
									</FormControl> */}

									<Autocomplete
										multiple
										disableCloseOnSelect
										id="demo-multiple-chip"
										options={roomTypes ? roomTypes : []}
										getOptionLabel={(option) => option.name_short}
										value={displayRoomTypes}
										onChange={handle}
										renderInput={(params) => (
											<TextField
											{...params}
											label="Chip"
											variant="outlined"
											/>
										)}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
											<Chip
												key={option.id}
												label={option.name_short}
												{...getTagProps({ index })}
											/>
											))
										}
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
