import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios, { formToJSON } from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Card,
	Collapse,
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import dayjs from 'dayjs';
import numberOfNights from '../utils/numberOfNights';

import { fetchRatePlans } from '../redux/ratePlansSlice';

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
		ratePlan: '',
		adults: 1,
		children: 0,
		note: ''
	})
	const [displayRoomTypes, setDisplayRoomTypes] = useState([])

	const [open, setOpen] = useState(false);
	const [dates, setDates] = useState(null);
	const [selectedRatePlan, setSelectedRatePlan] = useState(null);
	const ratePlans = useSelector(state => state.ratePlans.ratePlans);
	const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchRatePlans());
    }, [dispatch]);

	
	const isEmailValid = validateEmail(formData.email);
	const isPhoneNumberValid = validatePhoneNumber(formData.phoneNumber);

	const handleFormChange = (value, key) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[key]: value,
		  }));
	}

	const handle = (e, value) => {
		setDisplayRoomTypes(value)
	}


	// const handleCreateNewReservation = async (roomType, ratePlan) => {
	// 	try {
	// 		const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/new`, 
	// 		{

	// 		});
	// 	} catch(error) {
	// 		console.log(error)
	// 	}
	// }
    

	useEffect(() => {

		if (formData.checkIn && formData.numberOfNights ) {
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
		let datesTemp = [];
		let tempDate = formData.checkIn.clone() // Create a copy of checkIn using clone()


		for (let i = 0; i < formData.numberOfNights; i++) {
		  datesTemp.push(tempDate);
		  tempDate = tempDate.add(1, 'day');
		}

		// console.log('datestemp', datesTemp)
	  
		setDates(datesTemp);
	  }, [formData.checkIn, formData.numberOfNights]);


	useEffect(() => {
		console.log('roomTypes', roomTypes, ratePlans)
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
											label="Room Types"
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
								<Grid item>
									<TableContainer component={Paper}   sx={{ overflow:'auto'}}>
									<Table aria-label="collapsible table" size={'small'}>
										<TableHead>
											<TableRow>
												<TableCell>RoomType</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{displayRoomTypes.map((rt) => (
												<React.Fragment key={rt.id}>

												<TableRow sx={{  }}>
													<TableCell sx={{ fontWeight:'bold' }}>
														<IconButton
														aria-label="expand row"
														size="small"
														onClick={() => setOpen(rt.id)}
														>
														{open === rt.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
														</IconButton>
													
														{rt.name_short}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
														<Collapse in={open === rt.id} timeout="auto" unmountOnExit>
														<Box sx={{ margin: 1, overflow: 'auto', maxHeight:'200px' }}>
															<Table size="small" stickyHeader>
															<TableHead>
																<TableRow>
																<TableCell>Rate Plan</TableCell>
																{
																	dates && dates.map((d,i) => <TableCell key={i} >{ d.format('M/D') }</TableCell>)
																}
																</TableRow>
															</TableHead>
															<TableBody >
																	{
																		ratePlans && ratePlans.filter(rp => rp.room_type_id === rt.id ).map(ratePlan => 
																			<TableRow key={ratePlan.id} scope="row" hover
																				onClick={() => {
																					handleFormChange(rt, 'roomType');
																					handleFormChange(ratePlan, 'ratePlan')
																				}}
																			>
																				<TableCell>
																					{ ratePlan.name }
																				</TableCell>
																				{
																					dates && dates.map((d,i) => 
																					<TableCell key={i}>
																						${ ratePlan.base_price }
																					</TableCell>)
																				}
																			</TableRow>
																		)
																	}
															</TableBody>
															</Table>
														</Box>
														</Collapse>
													</TableCell>
												</TableRow>
												</React.Fragment>
											))}
										</TableBody>
									</Table>
									</TableContainer>
								</Grid>
							</Grid>
						</Grid>
						<Grid item width={'100%'}>
							<Grid  container direction="row" spacing={3} justifyContent='flex-end'>

								<Grid item>
									<Typography sx={{ fontWeight:'bold' }}>
										Room Type
									</Typography> 
									{ formData.roomType && formData.roomType.name_short  }
								</Grid>

								<Grid item>
									<Typography sx={{ fontWeight:'bold' }}>
										Avg Nightly Rate
									</Typography> 
									{ formData.ratePlan && formData.ratePlan.base_price  }
								</Grid>


								<Grid item>
									<Typography sx={{ fontWeight:'bold' }}>
										Rate Plan
									</Typography> 
									{ formData.ratePlan && formData.ratePlan.name  }
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

						<Grid item px={2}>
                            <Button 
                                variant='contained'
                                onClick={() => setDialog(false)}
                            >Create</Button>
                        </Grid>

                       
                    </Grid>
                </DialogActions>
            </Dialog>
    </>
  );
}

function Row(props) {
	const { roomType, ratePlans, checkIn, numberOfNights } = props;
	const [open, setOpen] = useState(false);

	const [dates, setDates] = useState(null);

	useEffect(() => {
		let datesTemp = [];
		let tempDate = checkIn.clone(); // Create a copy of checkIn using clone()
	  
		for (let i = 0; i < numberOfNights; i++) {
		  datesTemp.push(tempDate);
		  tempDate.add(1, 'day');
		}
	  
		setDates(datesTemp);
	  }, [checkIn, numberOfNights]);
	  
	return (
	  <React.Fragment>
		<TableRow sx={{  }}>
		  <TableCell sx={{ fontWeight:'bold' }}>
			<IconButton
			  aria-label="expand row"
			  size="small"
			  onClick={() => setOpen(!open)}
			>
			  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
			</IconButton>
		  
			{roomType.name_short}
		  </TableCell>
		</TableRow>
		<TableRow>
		  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
			<Collapse in={open} timeout="auto" unmountOnExit>
			  <Box sx={{ margin: 1, overflow: 'auto', maxHeight:'200px' }}>
				<Table size="small" stickyHeader>
				  <TableHead>
					<TableRow>
					  <TableCell>Rate Plan</TableCell>
					  {
						dates && dates.map((d,i) => <TableCell key={i} >{ d.format('M/D') }</TableCell>)
					  }
					</TableRow>
				  </TableHead>
				  <TableBody >
						{
							ratePlans && ratePlans.filter(rt => rt.room_type_id == roomType.id ).map(rt => 
								<TableRow key={rt.id} scope="row" hover>
									<TableCell>
										{ rt.name }
									</TableCell>
									{
										dates && dates.map((d,i) => 
										<TableCell key={i}>
											${ rt.base_price }
										</TableCell>)
									}
								</TableRow>
							)
						}
				  </TableBody>
				</Table>
			  </Box>
			</Collapse>
		  </TableCell>
		</TableRow>
	  </React.Fragment>
	);
  }

export default ReservationDetails;
