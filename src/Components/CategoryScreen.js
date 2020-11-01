import React,{useContext,useEffect,useState} from 'react';
import {Modal} from 'react-bootstrap';
import {AdminProductContext} from './Provider/AdminDataProvider';
import AddCategory from './AddCategoryScreen';

import {LIST_CATEGORY_REQUEST,LIST_CATEGORY_SUCCESS,LIST_CATEGORY_FAIL, 
        REMOVE_CATEGORY_REQUEST, REMOVE_CATEGORY_SUCCESS, REMOVE_CATEGORY_FAIL, 
        EDIT_CATEGORY_REQUEST,EDIT_CATEGORY_SUCCESS,EDIT_CATEGORY_FAIL} from './Provider/constants/Constant';
import {useAuth} from './Provider/authProvider';
import {API} from '../http';

function CategoryScreen() {
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const [state,dispatch] = useContext(AdminProductContext);
    const {isLoading,error,categories} = state;
    const [addModal,setAddModal] = useState(false);
    const [updateModal,setUpdateModal] = useState(false);
    const [id,setId] = useState();
    const [name,setName] = useState();
  
    const openAddModal = () => {
        setAddModal(true);
    };


    const closeAddModal = () =>{
        setAddModal(false);
        listCategories()
    }

    const openUpdateModal = (id,name) =>{
        setUpdateModal(true);
        setId(id);
        setName(name);
    }

    const closeUpdateModal = () =>{
        setUpdateModal(false);
        listCategories()
    }

    const getName = (e) =>{
        setName(e.target.value);
    }
  
  
    // delete category
    const onDeleted = async (id) =>{
            dispatch({
                type:REMOVE_CATEGORY_REQUEST
            })
        try{    
        const {data:{message}} = await API.delete(`/category/${id}`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:REMOVE_CATEGORY_SUCCESS,
                payload:message
            })
            if(message){
                listCategories()
            }
        }catch(err){
            dispatch({
                type:REMOVE_CATEGORY_FAIL,
                payload:err.response.data.message
            })
        }
        
       
    }

    // list categories
    const listCategories = async () =>{
        dispatch({
            type:LIST_CATEGORY_REQUEST
        })
    try{

        const {data:{data}} = await API.get('/category',{
            headers:{
                Authorization:`${userInfo.token}` 
            }
        })
      
        dispatch({
                type:LIST_CATEGORY_SUCCESS,
                payload:data
        })
        
    }catch(error){
            dispatch({
                type:LIST_CATEGORY_FAIL,
                payload:error.response.data.message
            })
            
        }
    }
     
    const updateData = {
        name:name 
    }
    // update category
    const onUpdated = async () =>{
    
            dispatch({
                type:EDIT_CATEGORY_REQUEST
            })
        try{    
        const {data:{message}} = await API.patch(`/category/${id}`,updateData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:EDIT_CATEGORY_SUCCESS,
                payload:message
            })
            if(message){
                listCategories()
            }
        }catch(err){
            dispatch({
                type:EDIT_CATEGORY_FAIL,
                payload:err.response
            })
        }
        setUpdateModal(false);   
    }

    useEffect(() => {
    listCategories();
    }, [])
    return (
        <div className="container">
            <div className="row admin-section">
                <div className="col-md-12 text-white category-section">
                    <div className="addCategory">
                        <h2>List Categories</h2>
                        <button className="btn btn-primary" onClick={openAddModal}>Add New Category</button>
                        <AddCategory  add={addModal} closeAdd={closeAddModal} listCategories={listCategories}/>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        { error ? <div>{error}</div> : categories ? categories.map(
                            (category,index) => (
                                <tr key={index}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                    <button className="btn btn-primary" onClick={ () => openUpdateModal(category.id,category.name)}>Update</button> | 
                                    <button className="btn btn-danger" onClick={() => onDeleted(category.id)} >Delete</button>
                                    <UpdateCategory update={updateModal} closeUpdate={closeUpdateModal} getName={getName} name={name} updated={onUpdated} />
                                    </td>
                                </tr>
                        )) : null}
                        </tbody>
                    </table>    
                </div> 
            </div>
        </div>
    )
}

export default CategoryScreen



// update category
function UpdateCategory(props){
 

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
                <button className="btn btn-success" onClick={props.updated}>Save</button>
                {" "}
                <button className="btn btn-danger" onClick={props.closeUpdate}>Close</button>
            </Modal.Footer>
        </div>
    </Modal>     
    )
}