import Button from 'react-bootstrap/Button'
import React from 'react'
import { ethers } from 'ethers'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../Assets/Images/logo-min.png'
import { useContext } from 'react'
import { ConnectionContext } from '../App'
import { useNavigate } from 'react-router-dom'

const NavigationBar = () => {

    const correctChain = '0x13881'
    // const correctChain = '0x1691'

    const [connected, setConnected, provider, setProvider, address, setAddress, , setIsChainCorrect] = useContext(ConnectionContext)
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
            setConnected(true)
            setProvider(provider)
            setAddress(account[0])
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
                <Button onClick={connect} className='navConnectBtn'>
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