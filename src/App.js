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
  const NFTAddress = '0xB03Ef8224206Dc6C31c64ef8778f4b016Fa54B7C'
  const TraitAddress = '0x553B871e97AAd05555655A8D99d5e07f17DA4925'
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
