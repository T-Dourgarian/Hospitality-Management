import './App.css';
import Nav from './components/Nav';
import { Provider } from 'react-redux'

import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
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
            <Nav />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
