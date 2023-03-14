import './App.css';
import Nav from './components/Nav';
import { Provider } from 'react-redux'
import store from './redux'

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Nav />
        </div>
    </Provider>
  );
}

export default App;
