import './Nav.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; // Grid version 1
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';


async function getArrivals() {
    try {
        let arrivals = [];

        // let response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/reservation/arrivals`);

        // arrivals = response.body;
            console.log('sdf')
    } catch(error) {
        console.log(error);
    }
}

function Nav() {
  return (
    <div className="App">
        <Grid container direction="row" spacing={2}>
            <Grid item width="10%">
                <List>
                    {['Arrivals'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => getArrivals()}
                            >
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item with="90%">

            </Grid>
        </Grid>
    </div>
  );
}

export default Nav;
