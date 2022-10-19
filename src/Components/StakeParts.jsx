import { Button } from "react-bootstrap";
import { useState,useContext } from "react";
import Body from "../Assets/NFT Layers/Body/1.png"
import { ConnectionContext,ContractContext, ServerContext } from "../App";
import { useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";


const StakeParts = (props) =>{


    const[serverURl]= useContext(ServerContext)
    var transparentImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    const [part1,setPart1]=useState()
    const [part2,setPart2]=useState(transparentImage)
    const [part3,setPart3]=useState(transparentImage)
    const [part4,setPart4]=useState(transparentImage)
    const [part5,setPart5]=useState(transparentImage)
    const [part6,setPart6]=useState(transparentImage)
    const [part7,setPart7]=useState(transparentImage)
    const [part8,setPart8]=useState(transparentImage)

    const[connected,setConnected,provider,,address,setAddress]=useContext(ConnectionContext)
    const[NFTABI,TraitABI,NFTAddress,TraitAddress] = useContext(ContractContext)

    const [data,setData] = useState([])
    const [minted,setMinted] = useState([])
    const[show,setShow] = useState(false)

    useEffect(()=>{
        async function getData() {
            var arr = props.tokenIDs
            var responseData = []
            for(var i=0;i<arr.length;i++){
                var response = await axios.get(serverURl+'metadataTrait/'+arr[i].toString())
                responseData.push(response.data)
            }
            seggregateData(responseData)
        }
        getData()
    },[]);
    
    function seggregateData(data){
        var traits = {}
        data.forEach((value)=>{
            if(!traits[value['data']['Trait']]){
                traits[value['data']['Trait']] = [value['image'],value['data']['Level']]
            }
        }
        )
        setMinted(traits)
    }

    function partClick(category,image,e){
        var list = document.getElementsByName(category)
        list.forEach(element=>{
            if(element.classList.contains('outline')){
                element.classList.toggle('outline')
            }
        });
        if(category==='LOWER BODY'){
            if(part1 === image){
                setPart1(transparentImage)
            }
            else{
                setPart1(image)
                e.target.classList.toggle('outline')
            }
            
        }
        else if(category==='EARS'){
            if(part2 === image){
                setPart2(transparentImage)
            }
            else{
                setPart2(image)
                e.target.classList.toggle('outline')
            }
            
        }
        else if(category==='EYES'){
            if(part3 === image){
                setPart3(transparentImage)
            }
            else{
                setPart3(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='UPPER HEAD'){
            if(part4 === image){
                setPart4(transparentImage)
            }
            else{
                setPart4(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='ARMS'){
            if(part5 === image){
                setPart5(transparentImage)
            }
            else{
                setPart5(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='NOSE'){
            if(part7 === image){
                setPart7(transparentImage)
            }
            else{setPart7(image)
                e.target.classList.toggle('outline')}
        }
        else if(category==='MOUTH'){
            
           if(part6 === image){
                setPart6(transparentImage)
            }
            else{
                setPart6(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='EYE ACCESSORIES'){
            if(part8 === image){
                setPart8(transparentImage)
            }
            else{
                setPart8(image)
                e.target.classList.toggle('outline')
            }
        }
    }

    async function approve(e){
        try{
            var contract = new ethers.Contract(TraitAddress,TraitABI,provider.getSigner())
            var result = await contract.isApprovedForAll(address,NFTAddress)
            if(result===false){
                var tx = await contract.setApprovalForAll(NFTAddress,true)
                var result = await tx.wait()
                if(result['status']===1){
                    console.log('approved')
                }
            }
        }
        catch(err){
            e.target.innerHTML ="Failed..Try again!"
        }
    }

    async function requestServer(tokenIDs){
        var data = new FormData()
        data.append('tokenIDs',tokenIDs)
        data.append('NFTID',props.mintedTamago)
        console.log(props.mintedTamago)
        var request = await axios.post(serverURl+'stake/',data,{headers:{"Content-Type": "multipart/form-data"}});
        if(request.status===200){
            return true;
        }
    }

    async function addStake(e){
        console.log(e)
        e.target.innerHTML ="Approving.."
        await approve(e)
        e.target.innerHTML="Staking..."
        var selectedParts = document.getElementsByClassName('outline')
        if(selectedParts.length===0){
            return
        }
        var tokenIDs=[]
        var amounts=[]
        for(var i=0;i<selectedParts.length;i++){
            var splitURL = selectedParts[i].src.split('/')
            tokenIDs.push(parseInt(splitURL.pop()))
            amounts.push(1)
        }
        try{
        var contract = new ethers.Contract(NFTAddress,NFTABI,provider.getSigner())
        console.log(props.mintedTamago)
        console.log(tokenIDs)
        console.log(amounts)
        
        var tx = await contract.stakeParts(props.mintedTamago,tokenIDs,amounts)
        var result = await tx.wait()
        if(result['status']===1){
        // if(true){
            await requestServer(tokenIDs)
            document.getElementById('partsDiv').style.display='none'
            document.getElementById('secondPartsDiv').style.display='none'
            document.getElementById('eggs').style.display='none'
            document.getElementById('txt').style.marginTop='300px'
            document.getElementById('txt').style.display='inline'
            
            document.getElementById('stakeBTN').style.display='none'
        }
        else{
            e.target.innerHTML="Failed...Try again!"
        }
        }
        catch(err){
            e.target.innerHTML="Failed...Try again!"
            console.log(err)
        }
    }

    return(
        <div>
            <div id='eggs'>
                <img className="partsHolder selected" src={Body}/>
            </div>
            <div id='tamago' style={{width:'100%',height:'250px',display:'flex',justifyContent:'center'}}>
                <img className='eggHolder' src={Body}/>
                <img className='eggHolder' src={part1}/>
                <img className='eggHolder' src={part2}/>
                <img className='eggHolder' src={part3}/>
                <img className='eggHolder' src={part4}/>
                <img className='eggHolder' src={part5}/>
                <img className='eggHolder' src={part6}/>
                <img className='eggHolder' src={part7}/>
                <img className='eggHolder' src={part8}/>
                <h1 id='txt' style={{display:'none'}}>Tamago Staked!</h1>
            </div>
            <div id='partsDiv'>
            {
                Object.entries(minted).slice(0,4).map((value,key)=>{
                    return(
                    <>
                    <div style={{display:'inline-block'}}>
                                <>
                                <img name={value[0]} className="partsHolder" src={value[1][0]} onClick={(e)=>{partClick(value[0],value[1][0],e)}}/>
                                <h6 className={value[1][1]}>{value[1][1]}</h6>
                                </>
                    </div>
                    </>
                    )
                })
            }
            </div>
            <div id='secondPartsDiv'>
            {
                Object.entries(minted).slice(4,8).map((value,key)=>{
                    return(
                    <>
                    <div style={{display:'inline-block'}}>
                                <>
                                <img name={value[0]} className="partsHolder" src={value[1][0]} onClick={(e)=>{partClick(value[0],value[1][0],e)}}/>
                                <h6 className={value[1][1]}>{value[1][1]}</h6>
                                </>
                    </div>
                    </>
                    )
                })
            }
            </div>
            <Button id='stakeBTN' style={{marginTop:'10px',marginBottom:'10px'}} onClick={(e)=>{addStake(e)}} className="mintBtn">Stake</Button>
        </div>
    );
}
export default StakeParts;