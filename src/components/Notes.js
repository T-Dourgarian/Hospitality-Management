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


function Notes({ notes, reservation_id }) {



    const [notesLocal, setNotesLocal] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [noteText, setNoteText] = useState('')

    useEffect(() => {

        if (notes) {
            let sortedNotes = notes.sort((b,a)=> {
                return new Date(a.f1.created_at).getTime() - new Date(b.f1.created_at).getTime() 
            })
    
            setNotesLocal(sortedNotes);
        } else {
            setNotesLocal(notes);
        }

    }, [reservation_id]);


    const createDialogToggle = () => {
        setCreateDialog(!createDialog)
    }
      
    const addNote = async () => {
        try {

            if (noteText) {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/notes/new`,{
                    text: noteText,
                    reservation_id
                });


            }
        } catch(error) {
            console.log(error);
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
                                Notes
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={createDialogToggle}
                                    sx={{ zIndex: '0 !important'}}
                                    size="small"
                                >
                                    <AddIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Box
                            sx={{
                                height:'250px',
                                overflowX:'hidden',
                                overflowY:'scroll'
                            }}
                        >
                            <Grid container 
                                direction="column"  
                            >
                                {
                                    notesLocal && notesLocal.map(note => 
                                        <Grid key={note.f1.id} item py={1} px={1}
                                            sx={{
                                                backgroundColor: '#ededed',
                                                borderRadius:'5px'
                                            }}
                                            mx={1}
                                            mt={1}
                                        >
                                            <Grid container direction="row"  alignItems='center'>
                                                <Grid item xs={10} 
                                                    sx={{ 
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    { note.f1.text }
                                                    <Box 
                                                
                                                        sx={{
                                                            fontSize:'12px',
                                                            color: 'grey',
                                                        }}
                                                    >
                                                        { note.f1.created_at.split('T')[0] + ' ' + (new Date(note.f1.created_at)).toLocaleTimeString()}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Box
                                                        
                                                    >
                                                        <Chip size="small" label={note.f2.last_name} variant="outlined" />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) 
                                }
                            </Grid>
                        </Box>
                    </Grid>
                        
                </Grid>
            </Card>


            <Dialog 
                open={createDialog} 
                onClose={createDialogToggle}
                fullWidth
            >
                
                <DialogContent >
                    <TextField
                        autoFocus
                        label="New Note"
                        fullWidth
                        rows={3}
                        multiline
                        onChange={(e) => setNoteText(e.target.value)}
                    />
                    
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
                            <Button 
                                variant='contained'
                                onClick={addNote}
                            >Add +</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>


        </ Grid>
    );
  }
  
  export default Notes;