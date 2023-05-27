import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Card,
    Chip,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Grid,
    Paper,
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
import AddIcon from '@mui/icons-material/Add';


function StayDetails({ stay_details, reservation_id, fetchReservationData }) {



    const [localStayDetails, setLocalStayDetails] = useState(stay_details ? stay_details.sort((a,b) => {
        return new Date(a.date) - new Date(b.date)
    }) : []);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [updateIds, setUpdateIds] = useState([]);
    const [newRate, setNewRate] = useState('');


    useEffect(() => {
        if (!Object.is(localStayDetails, stay_details)) {
            
            if (stay_details) {
                setLocalStayDetails(stay_details.sort((a,b) => {
                    return new Date(a.date) - new Date(b.date)
                }));
            }

        }
      }, [stay_details]);

    const handleRowSelect = (id) => {
        if (updateIds.includes(id)) {
            setUpdateIds(
                updateIds.filter(u => u !== id)
            )
        } else {
            setUpdateIds((prevData) => {
                return [...prevData, id]
            })
        }

    }



    const toggleUpdateDialog = (bool) => {
        setUpdateDialog(bool)
    }

    useEffect(() => {
        if (stay_details) {
            setLocalStayDetails(stay_details);
        } else {
            setLocalStayDetails([]);
        }
    }, [reservation_id]);


    const updateRates = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/staydetails/newrate`,
                {
                    updateIds,
                    newRate        
                }
            )

            fetchReservationData();
            
            setNewRate('');
        } catch(error) {
            console.log(error)
        }
    }


  

    return (
        <Grid container direction="column" py={1}>
            <Card 
            >
                <Grid 
                    container 
                    direction="column"  
                >

                    <Grid item px={1} pt={1}>
                        <Grid container justifyContent={'space-between'} pb={1} alignItems="center">
                            <Grid item>
                                Stay Details
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={() => toggleUpdateDialog(true)}
                                    sx={{ zIndex: '0 !important'}}
                                    size="small"
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <TableContainer component={Paper}
                            sx={{
                                maxHeight:'250px',
                                overflow:'auto'
                            }}
                        >
                                <Table size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            localStayDetails[0] && localStayDetails.map(s => 
                                                <TableRow key={s.id}>
                                                    <TableCell>
                                                        { s.date }
                                                    </TableCell>
                                                    <TableCell>
                                                        ${ s.rate }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    </Grid>
                        
                </Grid>
            </Card>


            <Dialog 
                open={updateDialog}
                fullWidth
            >
                
                <DialogContent >

                    <Box
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}
                        pb={1}
                    >
                        Stay Details
                    </Box>
                    
                    <TableContainer component={Paper} 
                        sx={{
                            maxHeight:'250px',
                            overflow:'auto'
                        }}
                    >
                        <Table size="small" aria-label="simple table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody
                            >
                                {
                                    localStayDetails[0] && localStayDetails.map(s => 
                                        <TableRow 
                                            key={s.id} 
                                            hover={true}
                                            onClick={() => handleRowSelect(s.id)}
                                        >
                                            <TableCell
                                                sx={{
                                                    borderLeft: updateIds.includes(s.id) ? '2px solid red !important' : ''
                                                }}
                                            >
                                                { s.id }
                                            </TableCell>
                                            <TableCell>
                                                { s.date }
                                            </TableCell>
                                            <TableCell>
                                                ${ s.rate }
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>

                            
                        </Table>
                    </TableContainer>


                    <Grid container>
                                <Grid item>
                                    <TextField
                                        name="New Rate"
                                        label="New Rate"
                                        value={ newRate }
                                        onChange={(e) => setNewRate(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                        size='small'
                                        type='number'
                                    />
                                </Grid>

                            </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent={'space-between'}>
                    
                        <Grid item px={2}>
                            <Button 
                                variant='outlined'
                                onClick={() => toggleUpdateDialog(false)}
                            >Cancel</Button>
                        </Grid>

                        <Grid item px={2}>
                            <Button
                                disabled={!updateIds[0] || newRate === ''}
                                variant='contained'
                                onClick={updateRates}
                            >
                                Update Selected Days
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>


        </ Grid>
    );
  }
  
  export default StayDetails;

  