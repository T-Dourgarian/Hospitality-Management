import './App.css';
import Nav from './components/Nav';
import { Provider } from 'react-redux'

import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect } from 'react';


const theme = createTheme({
  palette: {
    primary: {
      main: purple[200],
    },
    secondary: {
      main: '#f44336',
    },
  },
});


function App() {
  return (
    <Provider>
      <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Nav /> 
            </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
