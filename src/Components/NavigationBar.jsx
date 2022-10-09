import Button  from 'react-bootstrap/Button'
import React from 'react'
import {ethers} from 'ethers'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../Assets/Images/logo-min.png'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../App'

const NavigationBar = () => {

    const[connected,setConnected,provider,setProvider,address,setAddress] = useContext(AppContext)

    async function connect(){
        const provider =  new ethers.providers.Web3Provider(window.ethereum)
        const account = await provider.send('eth_requestAccounts',[])
        if(account.length>0){
            setConnected(true)
            setProvider(provider)
            setAddress(account[0])
        }
    }

  return (
    <Navbar className='navbarMain text'>
        <Navbar.Brand>
            <img className='navLogo' src={logo}/>
        </Navbar.Brand>
        <Navbar.Collapse className='justify-content-end'>
            <Button onClick={connect} className='navConnectBtn'>
                {
                    connected?
                    <>Connected</>:
                    <>Connect Wallet</>
                }
            </Button>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar