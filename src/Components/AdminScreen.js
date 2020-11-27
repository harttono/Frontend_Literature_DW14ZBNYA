import React,{useEffect,useState,useContext} from 'react';
import {FaCheckCircle} from 'react-icons/fa';
import {IconContext } from 'react-icons/lib';
import {useAuth} from './Provider/authProvider';
import {AdminProductContext} from './Provider/AdminDataProvider';
import {Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import {LIST_PRODUCTS_USER_REQUEST,LIST_PRODUCTS_USER_SUCCESS,LIST_PRODUCTS_USER_FAIL, 
     UPDATE_PRODUCT_USER_REQUEST,UPDATE_PRODUCT_USER_SUCCESS,UPDATE_PRODUCT_USER_FAIL,DELETE_PRODUCT_USER_REQUEST,
     DELETE_PRODUCT_USER_SUCCESS,DELETE_PRODUCT_USER_FAIL} from '../Components/Provider/constants/Constant'
import {API} from '../http';

export default function Admin() {
    const {state:authData} = useAuth();
    const {userInfo} = authData;
    const [state,dispatch] = useContext(AdminProductContext);
    const {loading,error,Products} = state;
    const [status,setStatus] = useState('');
    const [books,setBooks] = useState([]);

    const handleChange = (e) => {
            if(Products){
                let products = Products.slice();
                var filtered = e.target.value === 'all' ? products : products.filter( product => product.status === e.target.value);
                setBooks(filtered)
            }        
    }
    

    // list product admin
    let listProducts= async () =>{
        dispatch({
            type:LIST_PRODUCTS_USER_REQUEST
        })
    try{
        const {data:{data}} = await API.get(`/list_transaction`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
        if(data){
               setBooks(data)
        }
        dispatch({
            type:LIST_PRODUCTS_USER_SUCCESS,
            payload:data
        })
    }catch(error){
        dispatch({
            type:LIST_PRODUCTS_USER_FAIL,
            payload:error
        })
        }
    }

    // update data admin
    const onUpdated = async (id,data) =>{
        const updateData = {
            status:data
        }
            dispatch({
                type:UPDATE_PRODUCT_USER_REQUEST
            })
        try{    
        const {data:{message}} = await API.patch(`/list-transaction/${id}`,updateData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:UPDATE_PRODUCT_USER_SUCCESS,
                payload:message
            })
            if(message){
                listProducts()
            }
        }catch(err){
            dispatch({
                type:UPDATE_PRODUCT_USER_FAIL,
                payload:err.response.data.message
            })
        }  
    }

    // delete data admin
    const onDeleted = async (id) =>{
            dispatch({
                type:DELETE_PRODUCT_USER_REQUEST
            })
        try{    
        const {data:{message}} = await API.delete(`/list-transaction/${id}`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:DELETE_PRODUCT_USER_SUCCESS,
                payload:message
            })
            if(message){
                listProducts()
            }
        }catch(err){
            dispatch({
                type:DELETE_PRODUCT_USER_FAIL,
                payload:err.response.data.message
            })
        }
        
    }
    
 
    useEffect( () => { 
    listProducts();
 
    },[])
 
    return (
        <>
            <IconContext.Provider value={{color:'#3BB54A',size:'30px'}}>
            <div className="admin-section">
                <div className="container text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>List Verification</h2>
                        <Form>
                            <Form.Label>Sort By Status</Form.Label>
                                <Form.Control as="select" size="sm" custom onChange={handleChange}>
                                <option value='all'>All</option>
                                <option value='approved'>approved</option>
                                <option value='cancelled'>cancelled</option>
                                <option value='waiting to be verificated'>waiting to be verificated</option>
                            </Form.Control>
                        </Form>
                    </div>

                    
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Publisher</th>
                                <th scope="col">ISBN</th>
                                <th scope="col">Literature</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {loading ? <Loader/> : error ? <p>{error}</p> : books ? books.map((book,index) => (
                        <tr key={book.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{book.userId.fullname}</td>
                            <td>{book.ISBN}</td>
                            <td><Link to={`/detail/${book.id}`}>{book.attachment}</Link></td>
                            <td className="d-flex align-items-center">{book.status === "approved" ? <p style={{color:"#51B346"}}>{book.status}</p>:
                                 book.status === "waiting to be verificated" ? <p style={{color:"#F7BB00"}}>{book.status}</p> :
                                 book.status === "cancelled" ? <p style={{color:"#F70000"}}>{book.status}</p> : null}
                            </td>
                            <td>{book.status === 'approved' ? <FaCheckCircle/>:
                                 book.status === 'cancelled' ? <button className="btn btn-info" onClick={ () => onDeleted(book.id) }>Delete</button>:
                                 book.status !== "approved" ||  book.status !== "cancelled" || book.status == "waiting to be verificated" ? 
                                <div className="d-flex">
                                    <button className="btn btn-danger"  onClick={ () => onUpdated(book.id,'cancelled')}>cancelled</button>
                                    <span className="mx-2">{" "}</span>
                                    <button className="btn btn-success" onClick={ () => onUpdated(book.id,'approved')}>verificated</button>
                                </div>
                                :null }
                            </td>
                        </tr>
                        )):null }
                        </tbody>
                    </table>    
                </div>   
            </div>
            </IconContext.Provider>
        </>
    )
}
