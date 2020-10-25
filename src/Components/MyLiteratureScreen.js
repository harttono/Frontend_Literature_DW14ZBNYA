import React,{useContext,useEffect,useState} from 'react';
import {ProductContext} from './Provider/productProvider';
import {useAuth} from './Provider/authProvider';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import Axios from 'axios';
import {MY_PRODUCTS_REQUEST,MY_PRODUCTS_SUCCESS,MY_PRODUCTS_FAIL} from './Provider/constants/Constant';

export default function CartScreen() {
    const [state,dispatch] = useContext(ProductContext);
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const {isLoading,error,myBooks} = state;
    useEffect(()=>{
        const getMybook= async () =>{
            dispatch({
                type:MY_PRODUCTS_REQUEST
            })
        try{
            const {data:{data}} = await Axios.get(`/api/v1/mybooks`,{
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
                <div className={myBooks && myBooks.length > 4 ? 'page-books':  'page-books justify-content-start'}>
                { isLoading ? <Loader/> : error ? <div>{error}</div> : myBooks ? myBooks.map( book => 
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
                ) : <div className="text-white">you don't have a book.</div>}
                </div>
           </div>
    )
}


