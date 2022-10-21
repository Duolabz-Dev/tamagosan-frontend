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
  const NFTAddress = '0x391cDfe4De2CCc87fC668c7f66D613B132cd6466'
  const TraitAddress = '0x53a317D3ad5ecC1AFdC3D07315696857fE004089'
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [isChainCorrect,setIsChainCorrect] = useState(null)
  const serverURL = 'https://tamagosan.herokuapp.com/'
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
