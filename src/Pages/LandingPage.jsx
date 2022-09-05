import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { removeAllPaths } from '../redux/folderSlice';


const LandingPage = () => {
    const dispatch = useDispatch();

    const removePaths = () =>{
        dispatch(removeAllPaths());
    }
  return (
    
  <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
    <div>This is A GoogleDrive Clone</div>
    <Link to={'/folders'} onClick={removePaths}>Folders</Link>
  </div>
  )
}

export default LandingPage