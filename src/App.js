import './App.css';
import Nav from './components/Nav';
import { Provider } from 'react-redux'


function App() {
  return (
    <Provider>
        <div className="App">
            <Nav />
        </div>
    </Provider>
  );
}

export default App;
