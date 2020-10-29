import React,{useContext,useState,useEffect} from 'react';
import UploadServices from './services/FileUploadService';
import {Modal} from 'react-bootstrap';



const FileUploads = (props) => {
    const [selectedFiles,setSelectedFiles] = useState(undefined);
    const [currentFile,setCurrentFile] = useState(undefined);
    const [progress,setProgress] = useState(0);
    const [message,setMessage] = useState("");
    const [urlFiles,setUrlFiles] = useState([]);
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
                const urlData = response.data;
                setMessage(response.data.message);
                setUrlFiles([...urlFiles,urlData]);
            })
            .catch( () =>{
                setProgress(0);
                setMessage('Could not upload the file !');
                setCurrentFile(undefined);
            })

        setSelectedFiles(undefined);
    }
     
    useEffect(() => {
        if(urlFiles.length > 0){
            localStorage.setItem('url',JSON.stringify(urlFiles))
        }
        return () => {
           
        }

    }, [urlFiles])
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
                                        <input type="file" className="custom-file-input"  onChange={selectFile}/>
                                    <label className="custom-file-label" htmlfor="inputGroupFile01">choose file</label>
                                </div>

                                <button className="btn btn-success w-100 my-1" disabled={!selectedFiles || urlFiles === 2} onClick={upload}>
                                    Upload
                                </button>
                                
                                <div className="alert text-success text-center" role="alert">
                                    {message}
                                </div>
                            
                            {urlFiles.length === 1 && <div className="card my-2">
                                    <div className="card-header">List of files</div>
                                    <ul className="list-group list-group-flush">
                                        {urlFiles&& 
                                            urlFiles.map( (file,index) =>(
                                                <li className="list-group-item" key={index}>
                                                    <a href={file.url}>{file.filename}</a>
                                                </li>
                                            )) 
                                        }
                                    </ul>
                                </div>}      
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
          
    )
}


export default FileUploads