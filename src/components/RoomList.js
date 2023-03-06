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
    Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';

import ReservationTable from './ReservationsTable';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function RoomList() {


    const [expanded, setExpanded] = React.useState(false);
    const [roomList, setRoomList] = useState([]);
    const [filteredRoomList, setFilteredRoomList] = useState([])

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

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
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer  sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small" aria-label="simple table"  >
                      <TableHead>
                          <TableRow>
                              <TableCell>Room #</TableCell>
                              <TableCell>Status</TableCell>
                              {/* <TableCell>Check In</TableCell>
                              <TableCell>Check Out</TableCell>
                              <TableCell> # of Nights</TableCell>
                              <TableCell>Room #</TableCell>
                              <TableCell>Room Type</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Rate</TableCell>
                              <TableCell></TableCell> */}
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
                                      { r.status_name }
                                  </TableCell>
                                  {/* <TableCell align="right">{calories}</TableCell> */}
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