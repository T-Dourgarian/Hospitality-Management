import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Card,
    Chip,
    Divider,
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
import RoomTypeForcast from './RoomTypeForcast';

import RoomList from './RoomList';

function Notes({ notes }) {



    const [notesLocal, setNotesLocal] = useState(notes);

      useEffect(() => {
        // console.log('notes', notes);
      },[])
      
  

    return (
        <Card variant="outlined">
            <Grid container direction="column" pt={2}>
                {/* <Grid item xs={8}>
                    <TextField
                        id="outlined-textarea"
                        label="New Note"
                        multiline
                        fullWidth
                        rows={3}
                    />
                </Grid>
                <Grid item>
                    <Button 
                        // onClick={handleCheckIn}               
                        variant="contained"
                    >Add Note</Button>
                </Grid> */}

                {
                    notesLocal[0] && notesLocal.map(note => 
                        <Grid key={note.f1.id} item py={1} px={1} borderBottom='1px solid grey'>
                            <Grid container direction="row" >
                                <Grid item xs={10}>
                                    { note.f1.text }
                                </Grid>
                                <Grid item xs={2} textAlign='center'>
                                    <Box
                                        pb={1}
                                    >
                                        <Chip size="small" label={note.f2.last_name} variant="outlined" />
                                    </Box>
                                    <Box 
                                        
                                        sx={{
                                            fontSize:'12px',
                                            color: 'grey',
                                        }}
                                    >
                                        { note.f1.created_at.split('T')[0] }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) 
                }
                    
            </Grid>
        </Card>
    );
  }
  
  export default Notes;