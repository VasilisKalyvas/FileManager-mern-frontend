import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import {  useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { paths } from '../redux/folderSlice';
import { FaEye, FaFilePdf, FaFolder, FaImage, FaTools, FaTrash, FaVideo } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useEffect } from 'react';
import { AiOutlineFolderAdd , AiOutlineCloudUpload} from 'react-icons/ai';


const Table = ({item, filesInside}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileForOpen, setFileForOpen] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [folderName, setFolderName] = useState("");
    const [actionType, setActionType] = useState(false);
    const [idUpdate, setIdUpdate] = useState('');
    const [openFile, setOpenFile] = useState(false);
    const path = useLocation().pathname.split("/")[2];
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseFile = () => setOpenFile(false);
    const handleShowFile = () => setOpenFile(true);

    useEffect(() => {
      setFolders(item);
      setFiles(filesInside);
    }, [item,filesInside])

    const handleRedirect = (folderId, folderName) => {
      dispatch(paths({name: folderName, folderId: folderId}));
      navigate(`/folder/${folderId}`);
    }
    
    const handleCreateFolder = async (e) => {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/folder/${path || 'root'}`, {name: folderName}, {withCredentials: true});
      setLoading(false);
      setShow(false)
      console.log('Folder ',folderName,' just created!');
      setFolders([...folders, res.data]);
    }
    
    const handleDeleteFolder = async (folderId) => {
      await axios.delete(`http://localhost:5000/api/folder/delete/${folderId}`,{withCredentials: true});  
      setFolders(
        folders.filter((val)=> {
        return val._id !== folderId;
      }))
    }

    const handleUpdateFolder = async (e) => {
      e.preventDefault();
      setLoading(true);
      await axios.put(`http://localhost:5000/api/folder/update/${idUpdate}`, {name: folderName} ,{withCredentials: true});  
      setLoading(false);
      setShow(false);
      setFolders(
        folders.map((val) =>{
        return  val._id === idUpdate ? 
            { _id: idUpdate, 
              name: folderName, 
            } : val;
          }
      ))
    }

    let formdata = new FormData();

    const onFileChange = (e) => {
      formdata.append('file', e.target.files[0]);
      console.log(e.target.files[0]);
    }


    const handleCreateFile = async (e) => {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/file/${path || 'root'}`,formdata, {withCredentials: true});
      setLoading(false);
      setShow(false)
      console.log('File just created!');
      setFiles([...files, res.data]);
    }

    const handleDeleteFile = async (fileId) => {
      await axios.delete(`http://localhost:5000/api/file/delete/${fileId}`,{withCredentials: true});  
      setFiles(
        files.filter((val)=> {
        return val._id !== fileId;
      }))
    }
  return (
    <>
        <div style={{width: '90vw'}}className="crud shadow-lg p-4  bg-body rounded"> 
          <div className="row ">
           <div style={{display:'flex', justifyContent:'space-between', marginBottom: '30px', gap: '100px'}}>
                {/*
                <div className="col-sm-5 text-gred">
                  <form className="form-inline">
                  <input className="form-control mr-sm-2" type="search" placeholder="Search Student" aria-label="Search"/>
                  </form> 
                </div>  
               */}
                <div style={{display:'flex', gap: '15px'}}>
                  <AiOutlineFolderAdd style={{fontSize: '30px', cursor:'pointer'}} onClick={() => {handleShow(); setModalType("folder");}}/>
                  <AiOutlineCloudUpload style={{fontSize: '30px', cursor:'pointer'}} onClick={() => {handleShow(); setModalType("file");}}/>
              </div>
            </div>
           </div>  
            <div className="row">
                <div className="table-responsive " >
                 <table className="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name </th>
                            <th>type</th>
                            <th>size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { folders?.length === 0 && files?.length === 0 ? 
                            <tr><td>No Data..</td></tr>
                            :<>

                            {/*<!--- FOLDERS ---!> */}
                            {folders?.map((folder) => {
                              let folderSize = (folder?.files?.length + folder?.folders?.length) || 0;
                            return ( 
                                <tr key={folder._id}>
                                  <td 
                                    onClick={() => handleRedirect(folder._id, folder.name)} 
                                      style={{ display:'flex', 
                                              cursor: 'pointer', 
                                              alignItems:'center', 
                                              gap: '10px'}}>
                                    <FaFolder style={{cursor: 'pointer'}}/>
                                    <p style={{cursor: 'pointer'}}>{folder.name}</p>
                                  </td>
                                  <td><p>{folder.type}</p></td>
                                  <td><p>{folderSize}</p></td>
                                  <td>
                                    <div style={{display: 'flex', flexDirection:'row', gap:'20px'}}>
                                      <FaTools style={{color:"goldenrod", cursor:'pointer'}} onClick={() => {setIdUpdate(folder._id); setActionType(true); handleShow(); setModalType("folder");}}/>
                                      <FaTrash style={{color:"red", cursor:'pointer'}} onClick={() => {handleDeleteFolder(folder._id)}}/>  
                                    </div> 
                                  </td>
                                </tr>
                              )
                            })}
                          {/* <!---FILES ---!> */}

                            {files?.map((file) => {
                              return ( 
                                  <tr key={file._id}>
                                    <td
                                        style={{ display:'flex', 
                                                cursor: 'pointer', 
                                                alignItems:'center', 
                                                gap: '10px'}}>
                                        {
                                          file.type ==="image/jpeg" || file.type ==="image/png" || file.type ==="image/gif" || file.type ==="image/jpg"
                                            ? (<FaImage style={{cursor: 'pointer'}} onClick={() => {setOpenFile(!openFile); handleShowFile(); setFileForOpen(file);}}/>) : <></>
                                        }
                                        {
                                          file.type ==="folder"
                                            && (<FaFolder style={{cursor: 'pointer'}} onClick={() => {setOpenFile(!openFile); handleShowFile(); setFileForOpen(file);}}/>)
                                        }
                                        {
                                          file.type ==="video/mp4"
                                            && (<FaVideo style={{cursor: 'pointer'}} onClick={() => {setOpenFile(!openFile); handleShowFile(); setFileForOpen(file);}}/>)
                                        }
                                        {
                                          file.type ==="application/pdf"
                                            && (<FaFilePdf style={{cursor: 'pointer'}} onClick={() => {setOpenFile(!openFile); handleShowFile(); setFileForOpen(file);}}/>)
                                        }
                                        <p style={{cursor: 'pointer'}}>{file.name}</p>
                                    </td>
                                    <td><p>{file.type}</p></td>
                                    <td><p>{file.size}</p></td>
                                    <td>
                                      <div style={{display: 'flex', flexDirection:'row', gap:'20px'}}>
                                        <FaEye style={{color:"#10ab80", cursor:'pointer'}} onClick={() => {setOpenFile(!openFile); handleShowFile(); setFileForOpen(file);}}/>
                                        <FaTrash style={{color:"red", cursor:'pointer'}} onClick={() => {handleDeleteFile(file._id)}}/>  
                                      </div> 
                                    </td>
                                  </tr>
                                )
                              })}
                            </>
                          }
                    </tbody>
                </table>
            </div>   
        </div>  
 
        {/* <!--- Model Box ---> */}
        <div className="model_box">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{display: 'flex'}}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "file" ? <>
          { actionType ? <>Update File</> : <>New File</>}
          </> 
          : <>{ actionType ? <>Update Folder</> : <>New Folder</>}</> }</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <form>
                  {
                    modalType === "folder" 
                    ? 
                    <>
                        <div className="form-group">
                            <input type="text" className="form-control"
                                placeholder="Enter Folder Name" 
                                onChange={(e) => setFolderName(e.target.value)}/>
                        </div>
                    </> 
                    : 
                    <>
                      <div className="form-group">
                          <input type="file" className="form-control"
                              onChange={onFileChange}/>
                      </div>
                    </>
                  }
                  
                  { 
                     modalType === "file" 
                     ? 
                      <button className="btn btn-success mt-4" onClick={handleCreateFile}>
                      { loading ? <>Loading...</> : <>Create File</>}
                      </button>
                    :
                        actionType
                           ? <>
                              <button className="btn btn-success mt-4" onClick={handleUpdateFolder}>
                              { loading ? <>Loading...</> : <>Update Folder</>}
                              </button>
                            </>  
                          : <>
                              <button className="btn btn-success mt-4" onClick={handleCreateFolder}>
                              { loading ? <>Loading...</> :<>Create Folder</>}
                              </button>
                            </>
                    }
                </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
      </Modal>
       </div>

      {/* <!--- Model Box For Files---> */}
       <div className="model_box">
      <Modal
        show={openFile}
        onHide={handleCloseFile}
        backdrop="static"
        keyboard={false}
        size='lg'
      > 
      { fileForOpen.type === 'video/mp4' &&
      (<>
         <Modal.Header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign:'center',justifyContent: 'space-around'}} closeButton>
            {fileForOpen.name}
         </Modal.Header>
         <Modal.Body>
            <div className='res-container'>
              <iframe className="responsive-iframe"  src={`/uploads/${fileForOpen.name}`} title={fileForOpen.name}/>
            </div>
         </Modal.Body>
         <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseFile}>
                Close
              </Button>
         </Modal.Footer>
      </> )}
      { fileForOpen.type === 'application/pdf' &&
      (<>
         <Modal.Header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign:'center',justifyContent: 'space-around'}} closeButton>
            {fileForOpen.name}
         </Modal.Header>
         <Modal.Body>
            <div className='res-container'>
              <iframe className="responsive-iframe" src={`/uploads/${fileForOpen.name}`} title={fileForOpen.name} allowFullScreen/>
            </div>
        </Modal.Body>
         <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseFile}>
                Close
              </Button>
         </Modal.Footer>
      </> )}
        { fileForOpen.type === 'image/png' &&
        (<>
        <Modal.Header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign:'center',justifyContent: 'space-around'}} closeButton>
            {fileForOpen.name}
         </Modal.Header>
           <div className='image'>
              <img className="img-fluid" src={`/uploads/${fileForOpen.name}`} alt={fileForOpen.name}/>
           </div>
           <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseFile}>
                Close
              </Button>
         </Modal.Footer>
        </>)
        }
       
      </Modal>
       </div>    
      </div> 
    </>
  )
}

export default Table