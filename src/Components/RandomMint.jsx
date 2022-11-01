import { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import { ConnectionContext, ContractContext, ServerContext } from '../App'
import egg from '../Assets/Images/egg.png'
import { ethers } from 'ethers'
import axios from 'axios'
import { useState } from 'react'
import StakeParts from './StakeParts'

const RandomMint = () => {

    const [NFTABI, TraitABI, NFTAddress, TraitAddress] = useContext(ContractContext)
    const [connected, setConnected, provider, , address, setAddress, isChainCorrect] = useContext(ConnectionContext)
    const [serverUrl] = useContext(ServerContext)
    // const [image, setImage] = useState(egg)
    const [minted, setMinted] = useState(false)
    const [mintedIDs, setMintedIDs] = useState()
    const [mintedTamago, setMintedTamago] = useState()

    async function mintRandom(e) {
        e.target.innerHTML = '...'
        var body = new FormData();
        body.append('address', ethers.utils.getAddress(address))
        console.log(address)
        axios.post(serverUrl + 'mintRandom', body, { headers: { "Content-Type": "multipart/form-data" } }).then(async (response) => {
            if (response.status === 200) {
                var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())
                response.data['tokenIDs'] = getArray(response.data['tokenIDs'])
                var tx = await contract.randomMint(address, response.data['tokenIDs'], response.data['messageHash'], response.data['signature'])
                e.target.innerHTML = "Minting NFT and Parts!"
                var result = await tx.wait()
                if (result['status'] === 1) {
                    setMintedIDs(response.data['tokenIDs'])
                    setMintedTamago(await getTotalSupply())
                    setMinted(true)
                }
                else {
                    e.target.innerHTML = 'Failed'
                }
            }
            else {
                e.target.innerHTML = 'Failed'
            }
        })

    }

    function getArray(response) {
        console.log(response)
        var arr = []
        var splitResponse = response.split(',')
        splitResponse.map((value) => {
            arr.push(parseInt(value.replace('[', '').replace(']', '')))
        })
        return arr
    }

    async function getTotalSupply() {
        var contract = new ethers.Contract(NFTAddress, NFTABI, provider)
        var result = await contract.totalSupply()
        return parseInt(result.toString())
    }
    if (!minted) {
        return (
            <>
                <div>
                    <div>
                        <img className='eggHolder' style={{ position: 'relative' }} src={egg} />
                    </div>
                    <Button onClick={(e) => mintRandom(e)} className='mintBtn'>Random Mint!</Button>
                </div>
            </>
        );
    }
    else {
        return (
            <StakeParts mintedTamago={mintedTamago} tokenIDs={mintedIDs} />
        );
    }
}

export default RandomMint;