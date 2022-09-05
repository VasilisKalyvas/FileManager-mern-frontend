import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from '../Components/Table';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const FetchFolders = async () => {
            await axios.get('http://localhost:5000/api/folder/allroot',{withCredentials: true})
            .then((res) => {
                setFolders(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        FetchFolders();
    })

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <Link to={'/'}>Back to Home</Link>
        <div style={{display:'flex', alignItems:'center'}}><Link style={{textDecoration:'underline', cursor:'pointer'}} to={'/folders'}>root/</Link></div>
        <Table item={folders}/>
    </div>
  )
}

export default Home