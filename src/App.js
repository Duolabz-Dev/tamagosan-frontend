import logo from './logo.svg';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import Body from './Components/Body';
import { createContext,useState } from 'react';

export const AppContext = createContext()

function App() {

  const[connected,setConnected] = useState(false)
  const[provider,setProvider] = useState(null)
  const[address,setAddress] = useState(null)
  return (
    <div className="App text">
      <AppContext.Provider value={[connected,setConnected,provider,setProvider,address,setAddress]}>
        <NavigationBar></NavigationBar>
        <Body/>
      </AppContext.Provider>
    </div>
  );
}

export default App;
