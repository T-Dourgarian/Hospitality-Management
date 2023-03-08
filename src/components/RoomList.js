import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MMDD from '../utils/formatDate';
import { 
    Button,
    Grid,
    Paper,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    TextField,
    Collapse ,
    IconButton,
    Typography,
    Checkbox,
    FormControlLabel,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';

import ReservationTable from './ReservationsTable';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})

(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const statusCellStyle = (r) => {
  if (r.status_name == 'Clean') {
    return {
      backgroundColor: "green",
      color: 'white'
    }
  } else if (r.status_name == 'Dirty') {
    return {
      backgroundColor: "red",
      color: 'white'
    }
  }  else if (r.status_name == 'Turning') {
    return {
      backgroundColor: "#C3A923",
      color: 'white'
    }
  } else {
    return {}
  }
}

function RoomList({ reservation }) {


    const [expanded, setExpanded] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [filteredRoomList, setFilteredRoomList] = useState([])
    const [showVacant, setShowVacant] = useState(true);
    const [showOccupied, setShowOccupied] = useState(false);
    const [showClean, setShowClean] = useState(true);
    const [showDirty, setShowDirty] = useState(false);
    const [showTurning, setShowTurning] = useState(false);
    const [roomToAssign, setRoomToAssign] = useState({})
    const [confirmDirtyAssign, setConfirmDirtyAssign] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [roomTypeChecks, setRoomTypeChecks] = useState([reservation.name_short])

    const [assignDialog, setAssignDialog] = useState(false);

    const handleAssignOpen = (room) => {
      setRoomToAssign(room);
      setAssignDialog(true);
    };
  
    const handleAssignClose = () => {
      setConfirmDirtyAssign(false);
      setAssignDialog(false);
    };

    const handleCheckDirtyAssign = () => {
      setConfirmDirtyAssign(!confirmDirtyAssign)
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleVacantToggle = () => {
      setShowVacant(!showVacant);
    }

    const handleOccupiedToggle = () => {
      setShowOccupied(!showOccupied);
    }

    const handleRoomStatusFilter = (key) => {
      if (key === 'clean') {
        setShowClean(!showClean);
      } else if (key === 'dirty') { 
        setShowDirty(!showDirty);
      } else if (key === 'turning') {
        setShowTurning(!showTurning)
      }
    }

    // finish this
    const handleAssignRoom = () => {

    }
    

    const handleRoomTypeCheck = (roomType) => {
      if (roomTypeChecks.includes(roomType)) {
        setRoomTypeChecks(
          roomTypeChecks.filter(rt => {
            return !(rt === roomType)
          })
        )
      } else {
        setRoomTypeChecks(
          [...roomTypeChecks, roomType]
        )
      }
    }

    useEffect(() => {
      const getRoomList = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/room/all`);
        setRoomList(response.data)
        setFilteredRoomList(response.data.filter(room => {
          return room.status_name == 'Clean' && room.vacant
        }));

      }

      const getRoomTypeList = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/roomType`);

        setRoomTypes(response.data);
        

      }
      
      getRoomList();
      getRoomTypeList();

    },[])
    


    useEffect(() => {
      let statusFilter = [];

      if (showClean) statusFilter.push('Clean')
      if (showDirty) statusFilter.push('Dirty')
      if (showTurning) statusFilter.push('Turning')

      let newRoomList = filteredRoomList;

      // room status filtering
      newRoomList = roomList.filter(room => {
        return statusFilter.includes(room.status_name);
      })

      // vacant/occupied filtering
      newRoomList = newRoomList.filter(room => {
        if (showVacant && showOccupied) {
          return true;
        } else if (showVacant) {
          return room.vacant;
        } else if ( showOccupied) {
          return !room.vacant;
        }
      })


      newRoomList = newRoomList.filter(room => {
        return roomTypeChecks.includes(room.room_type)
      })

      setFilteredRoomList(newRoomList);
    }, [showClean, showDirty, showTurning, showVacant, showOccupied, JSON.stringify(roomTypeChecks)])


    return (
        <Grid container direction="column" >
            <Grid item>
              <Grid 
                container 
                direction="row" 
                spacing={12}
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    variant="h6"
                  >
                    Room Assignment
                  </Typography>
                </Grid>
                <Grid item>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    
                      <KeyboardArrowDownIcon />
                    
                  </ExpandMore>
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Collapse in={expanded} timeout="auto" unmountOnExit>

                <Grid container direction="row">
                  <Grid item>
                    <Grid container direction="column">
                      <Grid item >
                        <FormControlLabel
                          control={
                            <Checkbox 
                            size="small"
                              checked={showVacant}
                              onChange={handleVacantToggle}
                            />
                          }
                          label="Vacant"/>
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox 
                            size="small"
                              checked={showOccupied}
                              onChange={handleOccupiedToggle}
                            />
                          }
                          label="Occupied"/>
                      </Grid>
                    </Grid>
                  </Grid>

                  
                  <Divider orientation="vertical" flexItem/>

                  <Grid item pl={2}>
                      <Grid container direction="column">
                        <Grid item >
                          <FormControlLabel
                            control={
                              <Checkbox 
                                size="small"
                                checked={showClean}
                                onChange={() => handleRoomStatusFilter('clean')}
                              />
                            }
                            label="Clean"/>
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Checkbox 
                                size="small"
                                checked={showDirty}
                                onChange={() => handleRoomStatusFilter('dirty')}
                              />
                            }
                            label="Dirty"/>
                        </Grid>
                        <Grid item >
                          <FormControlLabel
                            control={
                              <Checkbox 
                                size="small"
                                checked={showTurning}
                                onChange={() => handleRoomStatusFilter('turning')}
                              />
                            }
                            label="Turning"/>
                        </Grid>
                      </Grid>
                  </Grid>
                  
                  <Divider orientation="vertical" flexItem/>

                  <Grid item pl={2}>
                    <Grid container direction="row" maxWidth={500}>
                      {
                        roomTypes[0] && roomTypes.map(roomType => 
                          <Grid item key={roomType.id}>
                            <FormControlLabel
                              // sx={{fontSize: '12px'}}
                              control={
                                <Checkbox 
                                  size="small"
                                  checked={roomTypeChecks.includes(roomType.name_short)}
                                  onChange={() => handleRoomTypeCheck(roomType.name_short)}
                                />
                              }
                              label={roomType.name_short}/>
                          </Grid>
                        )
                      }
                    </Grid>
                  </Grid>

                </Grid>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer  sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small" aria-label="simple table"  >
                      <TableHead>
                          <TableRow>
                              <TableCell>Assign</TableCell>
                              <TableCell>Room #</TableCell>
                              <TableCell>Room Type</TableCell>
                              <TableCell>VAC / OCC</TableCell>
                              <TableCell>Status</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {filteredRoomList && filteredRoomList.map( r => 
                              <TableRow
                                  key={r.id}
                              >
                                  <TableCell 
                                    component="th" 
                                    scope="row"
                                    sx={statusCellStyle(r)}
                                  >
                                    <Button
                                      variant="contained"
                                      disabled={!r.vacant}
                                      size="small"
                                      onClick={() => handleAssignOpen(r)}
                                    >Assign</Button>
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    { r.number }
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    { r.room_type }
                                  </TableCell>
                                  <TableCell >
                                    { r.vacant ? 'VAC' : 'OCC'}
                                  </TableCell>
                                  <TableCell 
                                    component="th" 
                                    scope="row"
                                  >
                                    { r.status_name }
                                  </TableCell>
                              </TableRow>
                          )}
                      </TableBody>
                  </Table>
                </TableContainer>
                </Paper>
              </Collapse>
            </Grid>

            <Dialog
              open={assignDialog}
              onClose={handleAssignClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
              Assign guest { reservation.last_name}, {reservation.first_name} to room {roomToAssign.number}?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Room {roomToAssign.number} has a status of {roomToAssign.status_name}

                  
                    {
                      roomToAssign.status_name === 'Dirty' &&
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              size="small"
                              checked={confirmDirtyAssign}
                              onChange={() => handleCheckDirtyAssign()}
                            />
                          }
                          label="ASSIGN GUEST TO DIRTY ROOM"/>
                      </Box>
                    }

                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAssignClose}>Back</Button>
                <Button 
                    onClick={handleAssignRoom} 
                    variant="contained"
                    disabled={ roomToAssign.status_name === 'Dirty' && !confirmDirtyAssign}
                >
                  Assign
                </Button>
              </DialogActions>
            </Dialog>

        </Grid>
    );
  }
  
  export default RoomList;