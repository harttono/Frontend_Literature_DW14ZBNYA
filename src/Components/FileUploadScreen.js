import React,{useState,useEffect} from 'react';
import UploadServices from './services/FileUploadService';
import {Modal} from 'react-bootstrap';
import path from 'path';

const FileUploads = (props) => {
    const [selectedFiles,setSelectedFiles] = useState(undefined);
    const [currentFile,setCurrentFile] = useState(undefined);
    const [progress,setProgress] = useState(0);
    const [message,setMessage] = useState("");
    const [notify,setNotify] = useState('');
    
    const selectFile = (e) => {
        const ext = path.extname(e.target.files[0].name);
        console.log('isi fle ext',props.types);
        let isValid = props.types.some( type => type === ext);
        if(!isValid){
               setNotify('Use extension properly !!!');
               setSelectedFiles(undefined)
        }
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
                if(urlData){
                    setProgress(0);
                    setCurrentFile(undefined);
                }
            })
            .catch( () =>{
                setProgress(0);
                setMessage('Could not upload the file !');
                setCurrentFile(undefined);
            })

        setSelectedFiles(undefined);
    }

    useEffect(() => {
        if (notify){
            setTimeout( () =>{
                setNotify('');
            },2000)
        }
        if(message){
            setTimeout( ()=>{
                setMessage('');
            },2000)
        }
    },[message,notify])
     
    return (
            
            <Modal show={props.show} onHide={props.closeModal}>
                <div className="uploader-container">
                    <Modal.Header closeButton >
                        <h3>Upload your file here</h3>
                    </Modal.Header>
                    <div className="modal-uploader">
                        <Modal.Body>
                                <div className="d-flex justify-content-center flex-column">
                                    {props.isAddLiterature ?
                                    <div>
                                        <p>1.upload your cover literature</p>
                                        <p>2.upload your literature with pdf extension only.</p>
                                    </div>
                                    : 
                                    <p>Change your profile.</p>}
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
                                    {notify && <p className="text-white bg-danger p-3">{notify}</p>}
                                </div>    
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
          
    )
}


export default FileUploads