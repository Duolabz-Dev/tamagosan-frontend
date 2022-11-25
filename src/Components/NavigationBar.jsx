import Button from 'react-bootstrap/Button'
import React from 'react'
import { ethers } from 'ethers'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../Assets/Images/logo-min.png'
import { useContext,useEffect } from 'react'
import { ConnectionContext } from '../App'
import { useNavigate } from 'react-router-dom'

const NavigationBar = () => {
    // polygon mumbai
    const correctChain = '0x13881'
    // ganache testing
    // const correctChain = '0x1691'


    window.ethereum.on('chainChanged',()=>{
        window.location.reload()
    })

    const [connected, setConnected, , setProvider, , setAddress, , setIsChainCorrect] = useContext(ConnectionContext)
    const nav =useNavigate()
    async function connect() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const account = await provider.send('eth_requestAccounts', [])
        if (account.length > 0) {
            chainCheck(account,provider)
        }
    }

    async function chainCheck(account,provider) {
        var chain = await window.ethereum.request({ method: 'eth_chainId' })
        console.log(chain)
        if (chain === correctChain) {
            nav('/mint')
            setIsChainCorrect(true)
            document.getElementById('connectBtn').classList.toggle('greenBorder')
            setConnected(true)
            setProvider(provider)
            setAddress(account[0])
            document.body.style.setProperty('background-color','#253b53','important')
        }
        else {
            setIsChainCorrect(false)
        }
    }

    return (
        <Navbar className='navbarMain text'>
            <Navbar.Brand>
                <img className='navLogo' src={logo} />
            </Navbar.Brand>
            <Navbar.Collapse className='justify-content-end'>
                <Button id='connectBtn' onClick={connect} className='navConnectBtn'>
                    {
                        connected ?
                            <>Connected</> :
                            <>Connect Wallet</>
                    }
                </Button>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar