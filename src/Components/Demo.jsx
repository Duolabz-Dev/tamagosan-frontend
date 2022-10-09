import { Button } from "react-bootstrap";
import { useState } from "react";
import Body from "../Assets/NFT Layers/Body/1.png"

import { useEffect } from "react";
import axios from "axios";


const Demo = (props) =>{

    var baseURI = 'https://tamagosan.herokuapp.com/metadataTrait/'
    const [part1,setPart1]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part2,setPart2]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part3,setPart3]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part4,setPart4]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part5,setPart5]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part6,setPart6]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part7,setPart7]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    const [part8,setPart8]=useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

    const [data,setData] = useState([])
    const [minted,setMinted] = useState([])

    useEffect(()=>{
        async function getData() {
            var arr = props.tokenIDs
            var responseData = []
            for(var i=0;i<arr.length;i++){
                //console.log(baseURI+value.toString())
                var response = await axios.get(baseURI+arr[i].toString())
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
                traits[value['data']['Trait']] = [value['image']]
            }
            else{
                traits[value['data']['Trait']].push(value['image'])
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
                setPart1('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart1(image)
                e.target.classList.toggle('outline')
            }
            
        }
        else if(category==='EARS'){
            if(part2 === image){
                setPart2('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart2(image)
                e.target.classList.toggle('outline')
            }
            
        }
        else if(category==='EYES'){
            if(part3 === image){
                setPart3('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart3(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='UPPER HEAD'){
            if(part4 === image){
                setPart4('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart4(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='ARMS'){
            if(part5 === image){
                setPart5('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart5(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='NOSE'){
            if(part6 === image){
                setPart6('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{setPart6(image)
                e.target.classList.toggle('outline')}
        }
        else if(category==='MOUTH'){
            
           if(part7 === image){
                setPart7('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart7(image)
                e.target.classList.toggle('outline')
            }
        }
        else if(category==='EYE ACCESSORIES'){
            if(part8 === image){
                setPart8('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
            }
            else{
                setPart8(image)
                e.target.classList.toggle('outline')
            }
        }
    }

    function test(part,index){
        // if(part===1){
        //     if(index===1){
        //         setPart1(Pants)
        //     }
        //     else{
        //         setPart1(Pants1)
        //     }
        // }
        // else if(part===2){
        //     if(index===1){
        //         setPart2(arms)
        //     }
        //     else{
        //         setPart2(arms1)
        //     }
        // }
        // else if(part===3){
        //     if(index===1){
        //         setPart3(eyes)
        //     }
        //     else{
        //         setPart3(eyes1)
        //     }
        // }
        // else if(part===4){
        //     if(index===1){
        //         setPart4(ears)
        //     }
        //     else{
        //         setPart4(ears1)
        //     }
        // }
        // else if(part===5){
        //     if(index===1){
        //         setPart5(glasses)
        //     }
        //     else{

        //     }
        // }
        // else if(part===6){
        //     if(index===1){
        //         setPart6(hair)
        //     }
        //     else{
        //         setPart6(hair1)
        //     }
        // }
        // else if(part===7){
        //     if(index===1){
        //         setPart7(mouth)
        //     }
        //     else{
        //         setPart7(mouth1)
        //     }
        // }
        // else if(part===8){
        //     if(index===1){
        //         setPart8(nose)
        //     }
        // }
    }

    return(
        <div>
            <div>
                <img className="partsHolder selected" src={Body}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/>
                <img className="partsHolder"/>
            </div>
            <div style={{width:'100%',height:'250px',display:'flex',justifyContent:'center'}}>
                <img className='eggHolder' src={Body}/>
                <img className='eggHolder' src={part1}/>
                <img className='eggHolder' src={part2}/>
                <img className='eggHolder' src={part3}/>
                <img className='eggHolder' src={part4}/>
                <img className='eggHolder' src={part5}/>
                <img className='eggHolder' src={part6}/>
                <img className='eggHolder' src={part7}/>
                <img className='eggHolder' src={part8}/>
            </div>
            <div>
                {/* <img className="partsHolder" src={Pants} onClick={()=>{test(1,1)}}/>
                <img className="partsHolder" src={Pants1} onClick={()=>{test(1,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={arms}onClick={()=>{test(2,1)}}/>
                <img className="partsHolder" src={arms1}onClick={()=>{test(2,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/>*/}
            </div> 
            <div>
                {/* <img className="partsHolder" src={eyes} onClick={()=>{test(3,1)}}/>
                <img className="partsHolder" src={eyes1} onClick={()=>{test(3,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={ears}onClick={()=>{test(4,1)}}/>
                <img className="partsHolder" src={ears1}onClick={()=>{test(4,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={glasses}onClick={()=>{test(5,1)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={hair}onClick={()=>{test(6,1)}}/>
                <img className="partsHolder" src={hair1}onClick={()=>{test(6,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={mouth}onClick={()=>{test(7,1)}}/>
                <img className="partsHolder" src={mouth1}onClick={()=>{test(7,2)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            <div>
                {/* <img className="partsHolder" src={nose}onClick={()=>{test(8,1)}}/>
                <img className="partsHolder"/>
                <img className="partsHolder"/>
                <img className="partsHolder"/> */}
            </div>
            {
                Object.entries(minted).map((value,key)=>{
                    return(
                    <div>
                        {
                            value[1].map(src=>{
                                return(
                                    <img name={value[0]} className="partsHolder" src={src} onClick={(e)=>{partClick(value[0],src,e)}}/>
                                )
                            }
                            )
                        }
                    </div>
                    )
                })
            }
            <Button style={{marginTop:'10px',marginBottom:'10px'}} className="mintBtn">Stake</Button>
        </div>
    );
}
export default Demo;