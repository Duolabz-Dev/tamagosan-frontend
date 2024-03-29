import { Button, Container, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import { ConnectionContext, ContractContext, ServerContext } from "../App";
import { ethers } from "ethers";
import { useEffect } from "react";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { RiArrowRightSLine, RiArrowLeftSLine, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { IconContext } from "react-icons";

const ViewEditTamagosan = () => {

    const [serverURl, spacesURL] = useContext(ServerContext)
    const [selectedID, setSelectedID] = useState(null)
    const [, , provider, , address, ,] = useContext(ConnectionContext)
    const [NFTABI, TraitABI, NFTAddress, TraitAddress] = useContext(ContractContext)
    const tamagoURL = 'https://tamagosan.fra1.cdn.digitaloceanspaces.com/tamagosanImage/'
    const [ownedNFTs, setOwnedNFTs] = useState([])
    const [noNFT, setNoNFT] = useState()
    const [stakedMetadata, setStakedMetadata] = useState([])
    const [stakedLoading, setStakedLoading] = useState(false)
    const [tamagoLoading, setTamagoLoading] = useState(false)
    const [stakedIDs, setStakedIDs] = useState([])
    const [availableTraits, setAvailableTraits] = useState([])
    const [hasStakedParts, setHasStakedParts] = useState(true)
    var transparentImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    const [part1, setPart1] = useState(transparentImage)
    const [part2, setPart2] = useState(transparentImage)
    const [part3, setPart3] = useState(transparentImage)
    const [part4, setPart4] = useState(transparentImage)
    const [part5, setPart5] = useState(transparentImage)
    const [part6, setPart6] = useState(transparentImage)
    const [part7, setPart7] = useState(transparentImage)
    const [part8, setPart8] = useState(transparentImage)
    const [refresh, setRefresh] = useState(true)
    const [message, setMessage] = useState("UPDATE YOUR TAMAGOSAN!")

    useEffect(() => {
        Loading()
    }, [])

    async function Loading() {
        setRefresh(true)
        await getOwnedTamagosans()
        await getOwnedTraits()
        setRefresh(false)
    }

    async function editComplete() {
        setTamagoLoading(true)
        setStakedLoading(true)
        resetSelectedAvailable()
        await resetStakedParts()
        await Loading()
        await getStakedIDs(selectedID)
        // reloadEditedTamagoImage(selectedID)
        setTamagoLoading(false)
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

    async function getStakedIDs(tamagoID) {
        setStakedLoading(true)
        var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())
        var result = await contract.getStakedTraits(tamagoID)
        if (result.length == 0) {
            setHasStakedParts(false)
            setStakedIDs([])
            console.log("Nothing staked")
            setStakedLoading(false)
            return
        }
        else {
            setHasStakedParts(true)
            setStakedIDs(result.toString().split(','))
            await getData(result.toString().split(','))
        }
        setStakedLoading(false)
    }

    async function tamagosanClick(ID) {

        resetStakedParts()
        resetSelectedAvailable()
        setSelectedID(ID)
        await getStakedIDs(ID)

    }

    async function resetStakedParts() {
        setPart1(transparentImage);
        setPart2(transparentImage);
        setPart3(transparentImage);
        setPart4(transparentImage);
        setPart5(transparentImage);
        setPart6(transparentImage);
        setPart7(transparentImage);
        setPart8(transparentImage);
    }

    function reloadEditedTamagoImage(ID) {

        var element = document.getElementById(ID)
        console.log(element)
        var temp = element.src
        element.src = transparentImage
        setTimeout(() => { element.src = temp }, 1000)
        // element.src = temp
    }

    async function getData(stakedIDs) {
        var arr = stakedIDs
        var responseData = []
        for (var i = 0; i < arr.length; i++) {
            var response = await axios.get(spacesURL + 'traitMetadata/' + arr[i].toString() + '.json', { headers: { 'Content-Type': 'application/json' } })
            console.log('wow')
            console.log(response)
            responseData.push(response.data)
        }
        seggregateData(responseData)
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


    function scrollTraitRow(id, bool) {
        var e = document.getElementById(id)
        if (bool) {
            e.scrollLeft += 100;
        }
        else {
            e.scrollLeft -= 100;
        }
        console.log(e)
    }

    function seggregateData(data) {
        var traits = {}
        data.forEach((value) => {
            if (!traits[value['data']['Trait']]) {
                traits[value['data']['Trait']] = [value['image'], value['data']['Category']]
            }
        }
        )
        setupStakedLayers(traits)
        setStakedMetadata(traits)
    }

    function setupStakedLayers(data) {
        console.log('toggle')
        Object.entries(data).map((value) => {
            toggleLayer(value[0], editImageLink(value[1][0]))
        })
    }

    async function getOwnedTraits() {
        var urlPath = serverURl + `getOwnedTraits/${address}?chain=mumbai&traitAddress=${TraitAddress}`
        var response = await axios.get(urlPath)
        console.log(response.data)
        setAvailableTraits(response.data)
    }

    function toggleLayer(category, image) {
        if (category === 'LOWER BODY') {
            setPart1(image)
        }
        else if (category === 'EARS') {
            setPart2(image)
        }
        else if (category === 'EYES') {
            setPart3(image)
        }
        else if (category === 'UPPER HEAD') {

            setPart4(image)

        }
        else if (category === 'ARMS') {

            setPart5(image)

        }
        else if (category === 'NOSE') {

            setPart7(image)

        }
        else if (category === 'MOUTH') {

            setPart6(image)

        }
        else if (category === 'ACCESSORIES') {

            setPart8(image)

        }
    }

    function resetSelectedAvailable(category = null) {
        if (category == null) {
            category = ['LOWER BODY', 'EARS', 'EYES', 'UPPER HEAD', 'ARMS', 'NOSE', 'MOUTH', 'ACCESSORIES']
            category.map(item => {
                var list = document.getElementsByName(item)
                list.forEach(element => {
                    if (element.classList.contains('outline')) {
                        element.classList.toggle('outline')
                    }
                })
            });
        }
        else {
            var list = document.getElementsByName(category)
            list.forEach(element => {
                if (element.classList.contains('outline')) {
                    element.classList.toggle('outline')
                }
            });
        }
    }

    function partClick(category, image, e) {
        e = e.target
        resetSelectedAvailable(category)
        if (category === 'LOWER BODY') {
            if (part1 === image) {
                setPart1(transparentImage)
            }
            else {
                setPart1(image)
                e.classList.toggle('outline')
            }

        }
        else if (category === 'EARS') {
            if (part2 === image) {
                setPart2(transparentImage)
            }
            else {
                setPart2(image)
                e.classList.toggle('outline')
            }

        }
        else if (category === 'EYES') {
            if (part3 === image) {
                setPart3(transparentImage)
            }
            else {
                setPart3(image)
                e.classList.toggle('outline')
            }
        }
        else if (category === 'UPPER HEAD') {
            if (part4 === image) {
                setPart4(transparentImage)
            }
            else {
                setPart4(image)
                e.classList.toggle('outline')
            }
        }
        else if (category === 'ARMS') {
            if (part5 === image) {
                setPart5(transparentImage)
            }
            else {
                setPart5(image)
                e.classList.toggle('outline')
            }
        }
        else if (category === 'NOSE') {
            if (part7 === image) {
                setPart7(transparentImage)
            }
            else {
                setPart7(image)
                e.classList.toggle('outline')
            }
        }
        else if (category === 'MOUTH') {

            if (part6 === image) {
                setPart6(transparentImage)
            }
            else {
                setPart6(image)
                e.classList.toggle('outline')
            }
        }
        else if (category === 'ACCESSORIES') {
            if (part8 === image) {
                setPart8(transparentImage)
            }
            else {
                setPart8(image)
                e.classList.toggle('outline')
            }
        }
    }

    function scrollAvailableDiv(bool) {
        var e = document.getElementById('allTraitDiv')
        if (bool) {
            e.scrollTop += 100
        }
        else {
            e.scrollTop -= 100
        }
    }

    function scrollCategoryDiv(bool) {
        var e = document.getElementById('categoryTraitDiv')
        if (bool) {
            e.scrollRight += 100
        }
        else {
            e.scrollRight -= 100
        }
    }


    async function editTamagosan(e) {
        var selectedPartsElements = document.getElementsByClassName('outline')
        await approve(e)
        e.target.innerHTML = "Editing..."
        var selectedTokenIDs = []
        var amounts = []
        for (let i = 0; i < selectedPartsElements.length; i++) {
            let splitURL = selectedPartsElements[i].src.split('/')
            selectedTokenIDs.push(parseInt(splitURL.pop()))
        }
        //not of intersection of arrays
        var idsToUnstake = stakedIDs.filter(value => !selectedTokenIDs.includes(parseInt(value)))
        for (let i = 0; i < idsToUnstake.length; i++) {
            amounts.push(1)
        }
        // var amountsStake = []
        var idsToStake = selectedTokenIDs.filter(value => !stakedIDs.includes(value.toString()))
        // for (let i = 0; i < idsToStake.length; i++) {
        //     amountsStake.push(1)
        // }
        var tokenIDsForMappingUnstake = stakedIDs.filter(value => !idsToUnstake.includes(value))
        try {
            var contract = new ethers.Contract(NFTAddress, NFTABI, provider.getSigner())

            // console.log('stake', idsToStake)
            // console.log('unstake', idsToUnstake)
            // console.log('tokenIds', selectedTokenIDs)

            // if (idsToUnstake.length > 0 && idsToUnstake[0] != '') {
            //     var tx = await contract.unstakeParts(selectedID, tokenIDsForMappingUnstake, idsToUnstake, amounts)
            //     var result = await tx.wait()
            // }
            // else {
            //     var result = true
            // }
            // if (result['status'] === 1 ) {
                // if (idsToStake.length > 0) {
                    console.log(idsToStake)
                    console.log(idsToUnstake)
                    console.log(selectedTokenIDs)
                    
                    var tx = await contract.editTamago(selectedID, idsToStake, idsToUnstake,selectedTokenIDs)
                    var resultResponse = await tx.wait()
                    
                // }
                // else {
                //     var resultResponse = true
                // }
                if (resultResponse['status'] === 1) {
                    await requestServer(selectedTokenIDs)
                    setMessage("Tamago Updated")
                    editComplete()
                }
                else{
                    e.target.innerHTML = "Failed...Try again!"
                }
            // }
            // else {
            //     e.target.innerHTML = "Failed...Try again!"
            // }
        }
        catch (err) {
            e.target.innerHTML = "Failed...Try again!"
            console.log(err)
        }
    }
    async function requestServer(tokenIDs) {
        var data = new FormData()
        data.append('tokenIDs', tokenIDs)
        data.append('NFTID', selectedID)
        var request = await axios.post(serverURl + 'stake/', data, { headers: { "Content-Type": "multipart/form-data" } });
        if (request.status === 200) {
            return true;
        }
    }

    function editImageLink(link) {
        var splitLink = link.split('/')
        var length = splitLink.length
        return spacesURL + splitLink[length - 2] + '/' + splitLink[length - 1]
    }

    async function approve(e) {
        try {
            var contract = new ethers.Contract(TraitAddress, TraitABI, provider.getSigner())
            var result = await contract.isApprovedForAll(address, NFTAddress)
            if (result === false) {
                var tx = await contract.setApprovalForAll(NFTAddress, true)
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

    if (noNFT) {
        return (<h1 style={{ marginTop: '20px' }}>No NFT Owned Mint a Tamagosan!</h1>)
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
                                <IconContext.Provider value={{ size: '30', color: 'black' }}>
                                    <RiArrowRightSLine style={{ position: 'absolute', right: '-25px', marginTop: 'auto', marginBottom: 'auto', top: '0', bottom: '0' }} onClick={() => scrollTamago(true)} />
                                    <RiArrowLeftSLine style={{ position: 'absolute', left: '-15px', marginTop: 'auto', marginBottom: 'auto', top: '0', bottom: '0' }} width={50} onClick={() => scrollTamago(false)} />
                                </IconContext.Provider>
                                <div id='tamagoContainer' style={{ marginLeft: '5px' }} className="viewTamagoContainer">

                                    {ownedNFTs.map((NFT) => {
                                        return (<>
                                            {/* {NFT==selectedID? */}
                                            <div style={{ display: 'inline-flex' }}>

                                                <LazyLoadImage id={NFT} onClick={async () => await tamagosanClick(NFT)} className='tamagoImage' src={tamagoURL + NFT + '.png?t=' + Date.now()} />
                                            </div>
                                            {/* : */}
                                            {/* <img onClick={async() => await tamagosanClick(NFT)} className='tamagoImage' src={tamagoURL + NFT + '.png'} /> */}
                                            {/* } */}
                                        </>
                                        )
                                    })}

                                </div>
                            </div> :
                            <Spinner animation="border" className="centerSpinner" />}
                    </div>

                    <div className="viewStakedSection">
                        <h5 style={{ position: 'absolute', top: '5px', color: 'white', left: '20px' }}>STAKED PARTS</h5>
                        <>
                            <>
                                {
                                    !stakedLoading ?
                                        <>
                                            {selectedID != null ?
                                                hasStakedParts ?
                                                    Object.entries(stakedMetadata).map(stakedData => {
                                                        return (
                                                            <img name={stakedData[0]} className="viewPartsHolder outline" src={editImageLink(stakedData[1][0])} onClick={
                                                                (e) => {
                                                                    partClick(stakedData[0], editImageLink(stakedData[1][0]), e)
                                                                }
                                                            } />
                                                        )
                                                    })
                                                    : <h2 style={{ color: 'white', marginTop: '20px' }}>No parts Staked!</h2> :
                                                <h2 style={{ color: 'white', marginTop: '20px' }}>Select a Tamagosan!</h2>
                                            }
                                        </> :
                                        <Spinner variant="light" className="centerSpinner" animation="border" />
                                }
                            </>
                        </>
                    </div>
                    <div className="viewPartsAndTamagoSection">
                        <div className="viewPartsSection">
                            <h6 style={{ color: 'white', marginTop: '8px', marginLeft: '8px', textAlign: 'left' }}>AVAILABLE PARTS</h6>
                            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                <RiArrowUpSLine onClick={() => scrollAvailableDiv(true)} />
                            </IconContext.Provider>
                            <div id='allTraitDiv' className="viewPartsScroll">
                                {!refresh ? <>

                                    {
                                        Object.entries(availableTraits).map((valueArray) => {
                                            return (<>
                                                {/* [trait,[image,category]] */}
                                                <h6 style={{ color: "white" }}>{valueArray[0]}</h6>
                                                <div className="viewAvailablePartsRow">
                                                    <div className="partsArrow" onClick={() => scrollTraitRow(valueArray[0] + 'Div', false)}>
                                                        <IconContext.Provider value={{ size: '20px', color: 'white' }}>
                                                            <RiArrowLeftSLine />
                                                        </IconContext.Provider>
                                                    </div>
                                                    <div id={valueArray[0] + 'Div'} className="viewAvailablePartsScroll">
                                                        {
                                                            valueArray[1].map((value) => {
                                                                return (
                                                                    <div style={{ position: 'relative', display: 'inline-block', margin: '4px' }}>
                                                                        <LazyLoadImage name={valueArray[0]} className="partsHolder" src={editImageLink(value[0])} onClick={(e) => { partClick(valueArray[0], editImageLink(value[0]), e) }} />
                                                                        <h6 className={value[1]}>{value[1]}</h6>
                                                                        {value[2] > 1 ? <h6 className="traitAmountTxt">{value[2]}</h6> : <></>}

                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className="partsArrow" onClick={() => scrollTraitRow(valueArray[0] + 'Div', true)}>
                                                        <IconContext.Provider value={{ size: '20px', color: 'white' }}>
                                                            <RiArrowRightSLine />
                                                        </IconContext.Provider>
                                                    </div>
                                                </div>
                                            </>)
                                        })
                                    }
                                </>
                                    :
                                    <Spinner variant="light" animation="border" className="centerSpinner" />
                                }
                            </div>
                            <IconContext.Provider value={{ color: 'white', size: '20px' }}>
                                <RiArrowDownSLine onClick={() => scrollAvailableDiv(false)} />
                            </IconContext.Provider>
                        </div>
                        <div className="viewTamagoSection">
                            <div className="viewFinalTamagoContainer">
                                {!tamagoLoading ? <>
                                    <img className="viewEggHolder" src={selectedID != null ? spacesURL + 'tamagoRawBody/' + selectedID + '.png' : transparentImage} />
                                    <img className='viewSelectedPartsHolder' src={part1} />
                                    <img className='viewSelectedPartsHolder' src={part2} />
                                    <img className='viewSelectedPartsHolder' src={part3} />
                                    <img className='viewSelectedPartsHolder' src={part4} />
                                    <img className='viewSelectedPartsHolder' src={part5} />
                                    <img className='viewSelectedPartsHolder' src={part6} />
                                    <img className='viewSelectedPartsHolder' src={part7} />
                                    <img className='viewSelectedPartsHolder' src={part8} />
                                </> : <Spinner animation="border" variant="light" className="centerSpinner" />}
                            </div>
                            <Button style={{ padding: '15px' }} className="pinkBtn" onClick={(e) => editTamagosan(e)}>{message}</Button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

export default ViewEditTamagosan;