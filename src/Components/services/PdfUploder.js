import React,{useState,useEffect} from 'react';
import {Modal,Form} from 'react-bootstrap';
import { useStorage } from "./useStorage";
import {Spinner} from 'react-bootstrap';

function PdfUploder(props) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);


    const types = ["application/pdf"];
    const handleChange = (e) => {
        let selectedFile = e.target.files[0];

        if (selectedFile) {
            if (types.includes(selectedFile.type)) {
                setError(null);
                setFile(selectedFile);
            } else {
                setFile(null);
                setError("Please select an pdf file only");
            }
        }
    };

    const {progress,url } = useStorage(file);
    

    useEffect(() => {
        if(progress === 100){
            props.getPdfUrl(url)
        }
        return () => {
            
        }
    }, [url])
    return (
        <div>
            <Modal show={props.visible} onHide={props.onClose} size="md"   centered>
                <div className="form-header">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Upload Your Literature
                        </Modal.Title>
                    </Modal.Header>
                </div>
                <div className="form-section">
                    <Modal.Body>
                        <div className="form-content">
                        <form>
                            <label>
                                <input type="file" onChange={handleChange} />
                            </label>
                        </form>
                        
                        {error && <p className="text-danger">{error}</p>}

                        {file && <p>{progress}% {progress >= 0 && progress < 100 ? 
                        <div>
                            <div className="text-white">Uploading...</div> 
                            <div className="text-center"><Spinner animation="grow" variant="success" size="sm" /></div> 
                        </div>
                        : <div className="text-success text-center">Your literature has been uploaded.</div>}</p>}

                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    )
}

export default PdfUploder
