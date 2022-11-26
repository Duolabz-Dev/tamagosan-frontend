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
  const NFTAddress = '0xbd1f170aA9FE9273af2c7037fE075e1b7918d629'
  const TraitAddress = '0x9D261e7747e17Db7eEfFEAf5F65aB421B97C20cf'
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [isChainCorrect,setIsChainCorrect] = useState(null)
  const serverURL = 'https://tamagosan-server-cmh4q.ondigitalocean.app/'
  // const serverURL = 'http://127.0.0.1:8000/'
  const spacesURl = 'https://tamagosan.fra1.cdn.digitaloceanspaces.com/'
  
  return (
    <div className="App text">
      <ConnectionContext.Provider value={[connected, setConnected, provider, setProvider, address, setAddress,isChainCorrect,setIsChainCorrect]}>
        <ContractContext.Provider value={[NFTABI,TraitABI,NFTAddress,TraitAddress]}>
          <ServerContext.Provider value={[serverURL,spacesURl]}>
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
