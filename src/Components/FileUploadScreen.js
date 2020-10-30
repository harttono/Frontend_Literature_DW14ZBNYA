import React,{useContext,useState,useEffect} from 'react';
import UploadServices from './services/FileUploadService';
import {Modal} from 'react-bootstrap';
const FileUploads = (props) => {
    const [selectedFiles,setSelectedFiles] = useState(undefined);
    const [currentFile,setCurrentFile] = useState(undefined);
    const [progress,setProgress] = useState(0);
    const [message,setMessage] = useState("");
    const selectFile = (e) => {
        setSelectedFiles(e.target.files);  
    }
    
    
    const upload = () =>{
        let currentFile = selectedFiles[0];
        setProgress(0);
        setCurrentFile(currentFile);

        UploadServices.upload(currentFile,(event) =>{
            setProgress(Math.round((100*event.loaded)/event.total));
        })
            .then(response =>{
                const urlData = response.data.url;
                props.getUrls(urlData);
                setMessage(response.data.message);
            })
            .catch( () =>{
                setProgress(0);
                setMessage('Could not upload the file !');
                setCurrentFile(undefined);
            })

        setSelectedFiles(undefined);
    }
     
    return (
            
            <Modal show={props.show} onHide={props.closeModal}>
                <div className="uploader-container">
                    <Modal.Header closeButton >
                        <h3>Upload your file here</h3>
                    </Modal.Header>
                    <div className="modal-uploader">
                        <Modal.Body>
                                <div className="d-flex justify-content-center flex-column">
                                    {props.able ?
                                    <p>Change your profile.</p>
                                    : 
                                    <div>
                                        <p>1.upload your cover literature</p>
                                        <p>2.upload you file literature with pdf extension only.</p>
                                    </div>}
                                </div>
                                <div className="py-3 progress-loader">
                                    {currentFile && (
                                        <div className="progress">
                                            <div className="progress-bar progress-bar-info progress-bar-striped" 
                                            role="progressbar" 
                                            aria-valuenow={progress} 
                                            aria-valuemin="0" aria-valuemax="100" 
                                            style={{width:progress+"%"}}>
                                                {progress} %
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="custom-file">
                                    <input type="file"   onChange={selectFile}/>     
                                </div>

                                <button className="btn btn-success w-100 my-1" disabled={!selectedFiles} onClick={upload}>
                                    Upload
                                </button>
                                
                                <div className="alert text-success text-center" role="alert">
                                    {message}
                                </div>    
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
          
    )
}


export default FileUploads