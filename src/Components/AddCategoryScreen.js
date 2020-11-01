import React,{useContext,useState} from 'react';
import {Modal,Spinner} from 'react-bootstrap';
import {AdminProductContext} from './Provider/AdminDataProvider';
import {ADD_CATEGORY_REQUEST,ADD_CATEGORY_SUCCESS,ADD_CATEGORY_FAIL} from './Provider/constants/Constant';
import {useAuth} from './Provider/authProvider';
import {API} from '../http';


function AddCategory(props){
    const [name,setName] = useState('');
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const [state,dispatch] = useContext(AdminProductContext);
    const {isLoading,error,category} = state;
    
    const CategoryData = {
        name:name
    }
    
    const onSaved = async (e) =>{
        e.preventDefault();
            dispatch({
                type:ADD_CATEGORY_REQUEST
            })
        try{    
        const {data:{message}} = await API.post('/category',CategoryData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:ADD_CATEGORY_SUCCESS,
                payload:message
            })
            if(message){
                props.listCategories()
            }
        }catch(err){
            dispatch({
                type:ADD_CATEGORY_FAIL,
                payload:err.response
            })
        }

        props.closeAdd();
        
    }
    return(
    <Modal show={props.add} onHide={props.closeAdd} centered size="md">
        <div className="message_box">
            <Modal.Body>
                <div className="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Name</span>
                    </div> 
                    <input type="text" class="form-control" autoComplete="off" onChange={ (e) => setName(e.target.value)}  aria-label="name" aria-describedby="basic-addon1"/>
                </div>
            </Modal.Body>   
            <Modal.Footer>
                {error && <div className="alert alert-warning">{error}</div>}
                <button className="btn btn-success" onClick={onSaved}>
                {isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/> : null}
                <span className="sr-only">{' '}</span>Save</button>
                {" "}
                <button className="btn btn-danger" onClick={props.closeAdd}>Close</button>
            </Modal.Footer>
        </div>
    </Modal>     
    )
}

export default AddCategory;