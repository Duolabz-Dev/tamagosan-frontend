import React from 'react'
import { useContext } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ConnectionContext } from '../App'
import Tamagosan from '../Assets/Images/banner image -min.png'
import RandomMint from './RandomMint'
import ViewEditTamagosan from './ViewEditTamagosan'

const Body = () => {

    const [connected, , , , , , isChainCorrect] = useContext(ConnectionContext)
    let navigate = useNavigate()

    if (!connected) {
        if (isChainCorrect === null) {
            return (
                <div className='text bodyDiv'>
                    <img width={400} src={Tamagosan} />
                    <h2 className='bodyText'>Create your customizable TAMAGOSAN!</h2>
                </div>
            )
        } else if (isChainCorrect === false) {
            return (<h1 className='text'>Incorrect Chain!</h1>);
        }
    }
    else if (connected) {
        return (
            <div>
                <ButtonGroup>
                    <Button onClick={()=>{navigate('/mint')}}>Mint</Button>
                    <Button onClick={()=>{navigate('/view')}}>View/Edit</Button>
                </ButtonGroup>
                    <Routes>
                        <Route path='/mint' element={<RandomMint/>}/>
                        <Route path='/view' element={<ViewEditTamagosan/>}/>
                    </Routes>
            </div>
        
        );
    }
}

export default Body