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
  const NFTAddress = '0x9e376077F5FD2a8DF9eC2eA39Fe9AF735c9bDb90'
  const TraitAddress = '0xA20bA187905cee463f57220fc5ee3B5Ae2382aA9'
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [isChainCorrect, setIsChainCorrect] = useState(null)
  const serverURL = 'https://tamagosan-server-cmh4q.ondigitalocean.app/'
  // const serverURL = 'http://127.0.0.1:8000/'
  const spacesURl = 'https://tamagosan.fra1.digitaloceanspaces.com/'

  return (
    <div className="App text">
      <ConnectionContext.Provider value={[connected, setConnected, provider, setProvider, address, setAddress, isChainCorrect, setIsChainCorrect]}>
        <ContractContext.Provider value={[NFTABI, TraitABI, NFTAddress, TraitAddress]}>
          <ServerContext.Provider value={[serverURL, spacesURl]}>
            <HashRouter>
              <NavigationBar />
              <Body />
            </HashRouter>
          </ServerContext.Provider>
        </ContractContext.Provider>
      </ConnectionContext.Provider>
    </div>
  );
}

export default App;
