import { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import { ConnectionContext, ContractContext, ServerContext } from '../App'
import egg from '../Assets/Images/egg.png'
import { ethers } from 'ethers'
import axios from 'axios'
import { useState } from 'react'
// import StakeParts from './StakeParts'
import { useNavigate } from 'react-router-dom'
// import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'

const RandomMint = () => {

    let navigate = useNavigate()


    const [NFTABI, , NFTAddress,] = useContext(ContractContext)
    const [, , provider, , address, ,] = useContext(ConnectionContext)
    const [serverURL, spacesURL] = useContext(ServerContext)
    // const [image, setImage] = useState(egg)
    const [minted, setMinted] = useState(false)
    const [mintedIDs, setMintedIDs] = useState()
    const [mintedTamago, setMintedTamago] = useState()

    async function mintRandom(e) {
        e.target.innerHTML = '...'
        var body = new FormData();
        console.log(spacesURL)
        body.append('address', ethers.utils.getAddress(address))
        console.log(address)
        axios.post(serverURL + 'mintRandom', body, { headers: { "Content-Type": "multipart/form-data" } }).then(async (response) => {
            if (response.status === 200) {
                var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())
                console.log(contract)
                response.data['tokenIDs'] = getArray(response.data['tokenIDs'])
                var tx = await contract.randomMint(address, response.data['tokenIDs'], response.data['messageHash'], response.data['signature'])
                e.target.innerHTML = "Minting NFT and Parts!"
                var result = await tx.wait()
                if (result['status'] === 1) {
                    getTraitData(response.data['tokenIDs'])
                    var mintedTamago = await getTotalSupply()
                    setMintedTamago(mintedTamago)
                    var response = await axios.get(serverURL + 'onMint', { params: { 'tokenID': mintedTamago } })
                    if (response.data != 1) {
                        console.log('Failed Image Upload')
                    }

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

    async function getTraitData(arr) {
        console.log(arr)
        var responseData = []
        for (var i = 0; i < arr.length; i++) {
            var response = await axios.get(spacesURL + 'traitMetadata/' + arr[i].toString() + '.json', { headers: { 'Content-Type': 'application/json' } })
            responseData.push(response.data)
        }
        seggregateData(responseData)
    }

    function seggregateData(jsonData) {
        // data [[image,level]]
        var data = []
        jsonData.forEach((json) => {
            data.push([json['image'], json['data']['Category']])
        }
        )
        console.log(data)
        setMintedIDs(data)
        setMinted(true)
    }

    function createTamagoClick() {
        navigate('/view')
    }

    if (!minted) {
        return (
            <>
                <div>
                    <div>
                        <img className='randomEggHolder' style={{ position: 'relative' }} src={egg} />
                    </div>
                    <Button onClick={(e) => mintRandom(e)} className='mintBtn'>Random Mint!</Button>
                </div>
            </>
        );
    }
    else {
        return (
            // <StakeParts mintedTamago={mintedTamago} tokenIDs={mintedIDs} />
            <div>
                <h2 style={{ margin: '10px', color: 'white' }}>MINT SUCCESSFUL!</h2>
                <img className='partsHolder selected' src={spacesURL + 'tamagoRawBody/' + mintedTamago + '.png'} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex' }}>
                        {
                            mintedIDs.slice(0, 4).map(data => {
                                return (
                                    <div style={{ display: '' }}>
                                        <img style={{ margin: '10px' }} className='partsHolder selected' src={data[0]} />
                                        <h6 className={data[1] != undefined ? data[1] : 'NoCategory'}>{data[1] != undefined ? data[1] : ''}</h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex' }}>
                        {
                            mintedIDs.slice(4, 7).map(data => {
                                return (
                                    <div style={{ display: '' }}>
                                        <img style={{ margin: '10px' }} className='partsHolder selected' src={data[0]} />
                                        <h6 className={data[1] != undefined ? data[1] : 'NoCategory'}>{data[1] != undefined ? data[1] : ''}</h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Button style={{ marginTop: '20px', padding: '10px' }} className='pinkBtn' onClick={createTamagoClick}>
                    CREATE YOUR TAMAGOSAN!
                </Button>
            </div>
        );
    }
}

export default RandomMint;