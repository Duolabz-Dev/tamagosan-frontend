import './App.css';
import NavigationBar from './Components/NavigationBar';
import Body from './Components/Body';
import NFTABI from './Assets/ABIs/NFTABI.json'
import TraitABI from './Assets/ABIs/TraitABI.json'

import { createContext, useState } from 'react';
import { HashRouter } from 'react-router-dom';

export const ConnectionContext = createContext()
export const ContractContext = createContext()
export const ServerContext = createContext()

function App() {
  const NFTAddress = '0xfc49a9c3324AaF43e006eF361c3b7b4463d556Bc'
  const TraitAddress = '0x29e27EFdc1e7FA7Bc4349e9E3628B77cB1fd77b2'
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [isChainCorrect,setIsChainCorrect] = useState(null)
  const serverURL = 'https://tamagosan-server-cmh4q.ondigitalocean.app/'
  // const serverURL = 'http://127.0.0.1:8000/'
  
  return (
    <div className="App text">
      <ConnectionContext.Provider value={[connected, setConnected, provider, setProvider, address, setAddress,isChainCorrect,setIsChainCorrect]}>
        <ContractContext.Provider value={[NFTABI,TraitABI,NFTAddress,TraitAddress]}>
          <ServerContext.Provider value={[serverURL]}>
            
            <HashRouter>
            <NavigationBar></NavigationBar>
              <Body />
            </HashRouter>
          </ServerContext.Provider>
        </ContractContext.Provider>
      </ConnectionContext.Provider>
    </div>
  );
}

export default App;
