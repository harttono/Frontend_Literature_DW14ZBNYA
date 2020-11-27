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

    useEffect(()=>{
        const getMybook= async () =>{
                dispatch({
                    type:MY_PRODUCTS_REQUEST
                })
        try{
                const {data:{data}} = await API.get(`/myLiteratures`,{
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
            <>
                <div className="pageBook__Section pt-2">
                    <div className={myLiterature && myLiterature.length > 4 ? 'page-books':  'page-books justify-content-start'}>
                        { isLoading ? <Loader/> : error ? <div>{error}</div> :  myLiterature.length > 0 ?  myLiterature.map( literature => 

                        <div className={literature.status == 'approved' ? 'card':'card pending-status-card'} disabled={literature.status === "waiting to be verificated"} key={literature.id}>
                                {literature.status !== "approved" && literature.status !== "cancelled" ?
                                <img src={literature.cover} className="card-img-top" alt="literature"/> :
                                <Link to={`/detail/${literature.id}`}>
                                    <img src={literature.cover} className="card-img-top" alt="literature"/>
                                </Link>
                                }
                                <div className="card-body text-white">
                                    <h5 className="card-title">{literature.title}</h5>
                                    <div className="card-content">
                                        <p className="card-text">{literature.author}</p>
                                        <p className="card-text">{literature.publication}</p>
                                    </div>
                                </div>
                                {literature.status === "waiting to be verificated" &&<div className="waiting-approval">waiting to be verificated.</div>}
                                {literature.status === "cancelled" && <div className="cancelled">cancelled.</div>}
                        </div>     
                        ):<div className="text-white">You don't have a literature.</div>}
                    </div>
                </div>
            </>
    )
}


