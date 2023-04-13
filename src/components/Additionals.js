import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Autocomplete,
    Button,
    Grid,
    Card,
    Radio,
    RadioGroup,
    FormLabel,
    FormControlLabel,
    FormControl,
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

import ReservationTable from './ReservationsTable';
import ReservationDialog from './ReservationDialog';

import AddIcon from '@mui/icons-material/Add';

function Additionals({ additionals, reservation_id }) {
      
    const [localAdditionals, setLocalAdditionals] = useState(null);

    const numberOfNights = (date1, date2) => {
        let start = new Date(date1);
        let end = new Date(date2);
        let timeDiff = Math.abs(end.getTime() - start.getTime());
        let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        return numberOfNights

    }


    useEffect(() => {
        setLocalAdditionals(additionals)
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
                                                { a.f1.price_actual }
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


                
            
        </Box>
    );
  }
  
  export default Additionals;