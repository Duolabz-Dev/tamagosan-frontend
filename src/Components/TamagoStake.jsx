import { Button, Container, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import { ConnectionContext, ContractContext, ServerContext } from "../App";
import { ethers } from "ethers";
import { useEffect } from "react";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { RiArrowRightSLine, RiArrowLeftSLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { IconContext } from "react-icons";
import stakerABI from '../Assets/ABIs/Staker.json'
import Countdown from "react-countdown";

const TamagoStake = () => {

    const [serverURl, spacesURL] = useContext(ServerContext)
    const [selectedID, setSelectedID] = useState(null)
    const [, , provider, , address, ,] = useContext(ConnectionContext)
    const [NFTABI, TraitABI, NFTAddress, TraitAddress] = useContext(ContractContext)
    const tamagoURL = 'https://tamagosan.fra1.cdn.digitaloceanspaces.com/tamagosanImage/'
    const [ownedNFTs, setOwnedNFTs] = useState([])
    const [noNFT, setNoNFT] = useState()
    const [noStake, setNoStake] = useState()
    var transparentImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    const [refresh, setRefresh] = useState(true)
    const [message, setMessage] = useState("....")
    const [stakeTamagos, setStakedTamagos] = useState([])

    const stakerAddress = '0x26d0Ad2c82Ef05d9dA2042332E8889459A99D274'
    const [showStakeInfo, setShowStakeInfo] = useState(false)

    const [stakeDuration,setStakeDuration] = useState('...')
    const [stakeReward,setStakeReward] = useState('...')
    const [stakedClick,setStakeClick] = useState(false)
    const [stakeEndTime,setStakeEndTime] = useState(null)
    const [stakeLoading,setStakeLoading] = useState(true)
    const [reload,setReload] = useState(false)
    

    useEffect(() => {
        Loading()
    }, [reload])

    async function Loading() {
        setRefresh(true)
        await getOwnedTamagosans()
        await checkStake()
        setRefresh(false)
    }


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

    async function checkStake() {
        try {
            var contract = new ethers.Contract(stakerAddress, stakerABI, provider.getSigner())
            var result = (await contract.getStakedTokenIds(address)).toString();
            setNoStake(false)
            setStakedTamagos(result.split(','))
            setStakeLoading(false)
        }
        catch (e) {
            console.log("No stake" + e)
            setNoStake(true)
            setStakeLoading(false)
        }
    }

    async function getFullset(tokenID){
        var res = await axios.get(spacesURL+'tamagosanMetadata/'+tokenID+'.json')
        var data = res.data
        try{
            console.log(data)
            var fullset = data['attributes'][data['attributes'].length-1]['trait_type']
            if(fullset!=='fullset'){
                return [false,'']
            }
            var value = data['attributes'][data['attributes'].length-1]['value']
            return [true,value.split(' ')[value.split(' ').length-1]]
        }
        catch{
            return [false,'']
        }
    }

    async function stakeUnstakeTamago(bool) {
        if(!selectedID){
            return
        }
        if (bool) {
            try {
                await approve()
                var contract = new ethers.Contract(stakerAddress, stakerABI, provider.getSigner())
                var fullset = await getFullset(selectedID)
                console.log(fullset)
                // return
                if (fullset[0]==true){
                    var tx = await contract.addStake(selectedID, 30,true,fullset[1])
                }
                else{
                    var tx = await contract.addStake(selectedID, 30,false,0)
                }
                var result = await tx.wait()
                console.log(result)
                if(result['status'] ==1){
                    setReload(!reload)
                }
            }
            catch(e) {
                setMessage('Failed!')
                console.log(e)
            }
        }
        else {

        }
    }


    function scrollTamago(bool) {
        var e = document.getElementById('tamagoContainer')
        if (bool) {
            e.scrollLeft += 100;
        }
        else {
            e.scrollLeft -= 100;
        }
        console.log(e)
    }

    async function approve(e) {
        try {
            var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())
            var result = await contract.isApprovedForAll(address, stakerAddress)
            if (result === false) {
                var tx = await contract.setApprovalForAll(stakerAddress, true)
                var result = await tx.wait()
                if (result['status'] === 1) {
                    console.log('approved')
                }
            }
        }
        catch (err) {
            e.target.innerHTML = "Failed..Try again!"
        }
    }

    function tamagosanClick(NFT,stakeUnstakeBool) {
        setSelectedID(NFT)
        if(!stakeUnstakeBool){
            getStakeInfo(NFT)
            setStakeClick(true)
        }
        else{
            setShowStakeInfo(false)
            setStakeClick(false)
            setMessage("STAKE YOUR TAMAGOSAN")
        }
        
    }

    async function getStakeInfo(NFT){
        console.log('hmmm')
        setStakeLoading(true)
        setShowStakeInfo(true)
        var contract = new ethers.Contract(stakerAddress,stakerABI,provider.getSigner())
        // var result = '30'
        setStakeDuration('30'+' '+'Days')
        console.log(address,selectedID)
        try{
        var res = await contract.getRewardForNFT(address,NFT)
        console.log(res.toString())
        setStakeReward(res.toString())
        var result = (await contract.getEndTime(NFT)).toString()
        console.log(parseInt(result),Date.now())
        setStakeEndTime(parseInt(result)*1000)
        setStakeLoading(false)
        }
        catch{
            console.log('error')
        }
    }

    if (noNFT && noStake) {
        return (<h1 style={{ marginTop: '20px' }}>No NFT Owned and None Staked!</h1>)
    }
    else {
        return (
            <div className="flex">
                <div className='viewInnerDiv'>

                    <div className="viewHeader">
                        <h2 className="viewPimpHeading">The PIMP FACTORY</h2>
                        <Button className="viewPaging">MY TAMAGOSAN!</Button>
                        {!refresh ?
                            <div style={{ position: 'relative', width: 'fit-content' }}>

                                {!noNFT ?
                                    <>
                                        <IconContext.Provider value={{ size: '30', color: 'black' }}>
                                            <RiArrowRightSLine style={{ position: 'absolute', right: '-25px', marginTop: 'auto', marginBottom: 'auto', top: '0', bottom: '0' }} onClick={() => scrollTamago(true)} />
                                            <RiArrowLeftSLine style={{ position: 'absolute', left: '-15px', marginTop: 'auto', marginBottom: 'auto', top: '0', bottom: '0' }} width={50} onClick={() => scrollTamago(false)} />
                                        </IconContext.Provider>
                                        <div id='tamagoContainer' style={{ marginLeft: '5px' }} className="viewTamagoContainer">

                                            {ownedNFTs.map((NFT) => {
                                                return (<>
                                                    <div style={{ display: 'inline-flex' }}>
                                                        <LazyLoadImage id={NFT} onClick={async () => await tamagosanClick(NFT,true)} className='tamagoImage' src={tamagoURL + NFT +'.png'} />
                                                    </div>
                                                
                                                </>
                                                )
                                            })}

                                        </div>
                                    </> :
                                    <div>
                                        <h1>Nothing to Show!</h1>
                                    </div>
                                }
                            </div> :
                            <Spinner animation="border" className="centerSpinner" />}
                    </div>

                    <div className="viewTamagoStakedSection">
                        <h5 style={{ position: 'absolute', top: '5px', color: 'white', left: '20px' }}>STAKED Tamagosans</h5>
                        <>
                            <>
                                {
                                    !refresh ?
                                        <>
                                            {
                                                stakeTamagos.map((NFT) => {
                                                    return (<div style={{ display: 'inline-flex' }}>
                                                        <LazyLoadImage id={NFT} onClick={async () => await tamagosanClick(NFT,false)} className='tamagoImage' src={tamagoURL + NFT + '.png'} />
                                                    </div>)
                                                })
                                            }
                                        </> :
                                        <Spinner className="centerSpinner" animation="border" />
                                }
                            </>
                        </>
                    </div>
                    <div className="viewPartsAndTamagoSection">
                        {!refresh?<>
                        <div className="viewTamagoSection">
                            <div className="viewFinalTamagoContainer">
                                {<>
                                    <img className="viewEggHolder" src={selectedID != null ? spacesURL + 'tamagosanImage/' + selectedID + '.png' : transparentImage} />
                                </>
                                }
                            </div>
                            {!stakedClick?
                            <Button style={{ padding: '15px' }} className="pinkBtn" onClick={(e) => stakeUnstakeTamago(true)}>{message}</Button>:
                            <>
                            <div className='pinkBtn' style={{color:'white',padding:'20px',marginLeft:'20px',marginRight:'20px'}}>
                                {!stakeLoading?
                                <Countdown date={stakeEndTime}/>:
                                <Spinner animation="border" />
                                }
                            </div>
                            </>
                            }
                        </div>
                        
                        {showStakeInfo ?
                            <div style={{width:'55%'}}>
                                {!stakeLoading?<>
                                <h1 style={{ color: 'white' ,padding:'10px'}}>Stake Info!</h1>
                                <h2 style={{ color: 'white' }}>Stake Duration: {stakeDuration}</h2>
                                <h2 style={{ color: 'white' }}>Stake Reward: {stakeReward}</h2>
                                </>:
                                <Spinner animation="border"/>
                                }
                            </div> :
                            <>
                            <div style={{width:'55%'}}>
                                <h1 style={{ color: 'white' ,padding:'10px'}}>Stake Duration: 30 Days!</h1>
                                
                            </div> 
                            </>
                        }
                        </>:
                        <Spinner className="centerSpinner" animation="border" />
                    }
                    </div>
                    
                </div>

            </div>
        );
    }

}

export default TamagoStake;
