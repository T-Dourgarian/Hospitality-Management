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
    FormControlLabel
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

function RoomList() {


    const [expanded, setExpanded] = React.useState(false);
    const [roomList, setRoomList] = useState([]);
    const [filteredRoomList, setFilteredRoomList] = useState([])
    const [showVacant, setShowVacant] = useState(true);
    const [showOccupied, setShowOccupied] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleVacantToggle = () => {
      setShowVacant(!showVacant);
    }

    const handleOccupiedToggle = () => {
      setShowOccupied(!showOccupied);
    }

    useEffect(() => {
      setFilteredRoomList(
        roomList.filter(room => {
          if (showVacant && showOccupied) {
            return true
          } else if (showVacant) {
            return room.vacant
          } else if ( showOccupied) {
            return !room.vacant
          }
        })
      )
    }, [showVacant, showOccupied])

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


      setFilteredRoomList(newRoomList);

    }, [showClean, showDirty, showTurning, showVacant, showOccupied])

    useEffect(() => {
        const getRoomList = async () => {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/room/all`);

          console.log(response.data);

          setRoomList(response.data)
          setFilteredRoomList(response.data);
        }

        getRoomList();

    },[])

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

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer  sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small" aria-label="simple table"  >
                      <TableHead>
                          <TableRow>
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
                                  <TableCell component="th" scope="row">
                                    { r.number }
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    { r.type_name_short }
                                  </TableCell>
                                  <TableCell >
                                    { r.vacant ? 'VAC' : 'OCC'}
                                  </TableCell>
                                  <TableCell 
                                    component="th" 
                                    scope="row"
                                    sx={statusCellStyle(r)}
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
        </Grid>
    );
  }
  
  export default RoomList;