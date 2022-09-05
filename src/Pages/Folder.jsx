import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../Components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, removeAllPaths, removePath } from '../redux/folderSlice';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Spinner from 'react-bootstrap/Spinner';

const Folder = () => {
    const [insideFolder, setInsideFolder] = useState([]);
    const [filesInsideFolder, setFilesInsideFolder] = useState([]);
    const [loading, setLoading] = useState([]);
    const path = useLocation().pathname.split("/")[2];
    const { folders } = useSelector((state) => state.folders);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchInsideFolder = async () => {
            dispatch(fetchStart());
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/folder/folderfiles/${path}`,{withCredentials: true})
            setInsideFolder(res.data);
            setLoading(false);
        }
        fetchInsideFolder();
        const fetchFilesInsideFolder = async () => {
            dispatch(fetchStart());
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/file/all/${path}`,{withCredentials: true})
            setFilesInsideFolder(res.data);
            setLoading(false);
        }
        fetchFilesInsideFolder();
    },[dispatch, path])

    const HandleRedirect = (folderId) => {
        dispatch(removePath(folderId));
        navigate(`/folder/${folderId}`);
    }

    const removePaths = () =>{
        dispatch(removeAllPaths());
        navigate(`/folders`);
    }
  return (
    <div>
        <Breadcrumb>
            <Breadcrumb.Item style={{cursor:'pointer', 
                textDecoration:'underline'}} 
                onClick={removePaths}>
                root
            </Breadcrumb.Item>
            { 
                folders?.map((folder) => (
                    <Breadcrumb.Item style={{cursor:'pointer', textDecoration:'underline'}} key={folder.folderId} onClick={() => HandleRedirect(folder.folderId)}>
                     {folder.name}
                    </Breadcrumb.Item >
                ))
            }
        </Breadcrumb>
         {
            loading 
            ? 
                <Spinner style={{padding: '40px', marginTop:'30px'}}animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            : <Table key={insideFolder._id} item={insideFolder} filesInside={filesInsideFolder}/>
         }
            
    </div>
  )
}

export default Folder