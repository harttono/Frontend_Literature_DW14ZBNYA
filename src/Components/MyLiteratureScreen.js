import React,{useContext,useEffect,useState} from 'react';
import {ProductContext} from './Provider/productProvider';
import {useAuth} from './Provider/authProvider';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import {MY_PRODUCTS_REQUEST,MY_PRODUCTS_SUCCESS,MY_PRODUCTS_FAIL} from './Provider/constants/Constant';
import {API} from '../http';

export default function CartScreen() {
    const [state,dispatch] = useContext(ProductContext);
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const {isLoading,error,myLiterature} = state;
    console.log('isi my', myLiterature)
    useEffect(()=>{
        const getMybook= async () =>{
            dispatch({
                type:MY_PRODUCTS_REQUEST
            })
        try{
            const {data:{data}} = await API.get(`/mybooks`,{
                headers:{
                    Authorization:`${userInfo.token}`
                }
            })
        
            dispatch({
                type:MY_PRODUCTS_SUCCESS,
                payload:data
            })
     
        }catch(error){
            dispatch({
                type:MY_PRODUCTS_FAIL,
                payload:error
            })
            }
        }

        getMybook();
    },[])
    return (
          <div className="pageBook__Section pt-4">
                <div className={myLiterature && myLiterature.length > 4 ? 'page-books':  'page-books justify-content-start'}>
                { isLoading ? <Loader/> : error ? <div>{error}</div> :  myLiterature ?  myLiterature.map( book => 
                    <div className={book.status == 'approved' ? 'card':'card pending-status-card'} disabled={book.status === "waiting to be verificated"}>
                        {book.status !== "approved" && book.status !== "cancelled" ?
                         <img src={book.cover} className="card-img-top" alt="book"/> :
                        <Link to={`/detail/${book.id}`}>
                            <img src={book.cover} className="card-img-top" alt="book"/>
                        </Link>
                        }
                        <div className="card-body text-white">
                            <h5 className="card-title">{book.title}</h5>
                            <div className="card-content">
                                <p className="card-text">{book.author}</p>
                                <p className="card-text">{book.publication}</p>
                            </div>
                        </div>
                        {book.status === "waiting to be verificated" &&<div className="waiting-approval">waiting to be verificated.</div>}
                        {book.status === "cancelled" && <div className="waiting-approval">cancelled.</div>}
                    </div>     
                ) : !myLiterature && <div className="text-white">you don't have a literature.</div>}
                </div>
           </div>
    )
}


