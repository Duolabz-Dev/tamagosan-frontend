import { Button } from "react-bootstrap";
import { useContext, useState } from "react";
import { ConnectionContext, ContractContext, ServerContext } from "../App";
import { ethers } from "ethers";
import { useEffect } from "react";
import EditTamagosan from "./EditTamagosan";

const ViewEditTamagosan = () => {

    const [editMode, setEditMode] = useState(false)
    const [selectedID, setSelectedID] = useState()
    const [connected, setConnected, provider, , address, setAddress, isChainCorrect] = useContext(ConnectionContext)
    const [NFTABI, TraitABI, NFTAddress, TraitAddress] = useContext(ContractContext)
    const tamagoURL = 'https://tamagosan.fra1.digitaloceanspaces.com/tamagosanImage/'
    const [ownedNFTs, setOwnedNFTs] = useState([])
    const [noNFT, setNoNFT] = useState()

    useEffect(() => {
        getOwnedTamagosans()
    }, [])

    async function getOwnedTamagosans() {
        var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())
        var result = await contract.getOwnedNftIDs()
        if (result.toString() === '') {
            setNoNFT(true)
        }
        else {
            result = result.toString().split(',')
            setOwnedNFTs(result)
        }
    }

    function viewStakedParts(ID) {
        setSelectedID(ID)
        setEditMode(true)
    }

    if (!editMode) {
        if (noNFT) {
            return (<h1 style={{marginTop:'20px'}}>No NFT Owned Mint a Tamagosan!</h1>)
        }
        else {
            return (
                <div className="tamagoContainer">
                    <h3>Owned Tamagosans</h3>
                    {ownedNFTs.map((NFT) => {
                        return (
                            <img onClick={() => viewStakedParts(NFT)} className='tamagoImage' src={tamagoURL + NFT + '.png' + '?t='+new Date().getTime()} />
                        )
                    })}
                </div>
            );
        }
    }
    else {
        return (
            <EditTamagosan tokenID={selectedID} />
        )
    }
}

export default ViewEditTamagosan;