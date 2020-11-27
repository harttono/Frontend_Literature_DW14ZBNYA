import React,{useContext,useEffect} from 'react';
import {Modal,Spinner} from 'react-bootstrap';
import {UPDATE_CATEGORY_REQUEST,UPDATE_CATEGORY_SUCCESS,UPDATE_CATEGORY_FAIL} from './Provider/constants/Constant';
import {AdminProductContext} from './Provider/AdminDataProvider';
import {useAuth} from './Provider/authProvider';
import {API} from '../http';

function UpdateCategory(props){
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const [state,dispatch] = useContext(AdminProductContext);

  
    
    // update category
    const updated = async () =>{
        
        const updateData = {
            name:props.name
        }
            dispatch({
                type:UPDATE_CATEGORY_REQUEST
            })
        try{    
        const {data:{message}} = await API.patch(`/category/${props.id}`,updateData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:UPDATE_CATEGORY_SUCCESS,
                payload:message
            })
            if(message){
               props.listCategories();
            }
        }catch(err){
            dispatch({
                type:UPDATE_CATEGORY_FAIL,
                payload:err.response
            })
        }

        props.closeUpdate();
    }



    return(
    <Modal show={props.update} onHide={props.closeUpdate} centered size="md">
        <div className="message_box">
            <Modal.Body>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Name</span>
                    </div> 
                    <input type="text" className="form-control" autoComplete="off" value={props.name} onChange={ (e) => props.getName(e)}  aria-label="name" aria-describedby="basic-addon1"/>
                </div>
            </Modal.Body>   
            <Modal.Footer>
                <button className="btn btn-success" onClick={updated}>
                {props.isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/> : null}
                Save</button>
                {" "}
                <button className="btn btn-danger" onClick={props.closeUpdate}>Close</button>
            </Modal.Footer>
        </div>
    </Modal>     
    )
}

export default UpdateCategory;