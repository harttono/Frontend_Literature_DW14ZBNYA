import React,{useContext,useEffect,useState} from 'react';
import {AdminProductContext} from './Provider/AdminDataProvider';
import AddCategory from './AddCategoryScreen';
import UpdateCategory from './UpdateCategoryScreen';

import {LIST_CATEGORY_REQUEST,LIST_CATEGORY_SUCCESS,LIST_CATEGORY_FAIL, 
        DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAIL} from './Provider/constants/Constant';
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
    }

    const getName = (e) =>{
        setName(e.target.value);
    }
  
    // delete category
    const deleted = async (id) =>{
            dispatch({
                type:DELETE_CATEGORY_REQUEST
            })
        try{    
        const {data:{message}} = await API.delete(`/category/${id}`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:DELETE_CATEGORY_SUCCESS,
                payload:message
            })
            if(message){
                listCategories();
            }
        }catch(err){
            dispatch({
                type:DELETE_CATEGORY_FAIL,
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
     
    useEffect( () =>{
        listCategories();
    },[])

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 category-section">
                    <div className="addCategory">
                        <h2>List Categories</h2>
                        <button className="btn btn-primary" onClick={openAddModal}>Add New Category</button>
                        <AddCategory  add={addModal} close={closeAddModal} listCategories={listCategories}/>
                    </div>
                    <table className="table table-striped">
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
                                    <td>{index + 1}</td>
                                    <td>{category.name}</td>
                                    <td >
                                        <button className="btn btn-primary mx-2" onClick={ () => openUpdateModal(category.id,category.name)}>Update</button> 
                                        <button className="btn btn-danger  ml-2" onClick={() => deleted(category.id)} >Delete</button>
                                        <UpdateCategory update={updateModal} closeUpdate={closeUpdateModal} getName={getName} name={name} id={category.id} isLoading={isLoading} listCategories={listCategories} />
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


