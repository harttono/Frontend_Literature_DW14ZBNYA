import React,{useEffect} from 'react';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import {useAuth} from './Provider/authProvider';
import {useBookMark} from './Provider/bookmarkProvider'
import {LIST_COLLECTION_REQUEST,LIST_COLLECTION_SUCCESS,LIST_COLLECTION_FAIL} from './Provider/constants/Constant';
import {API} from '../http';

function MyCollectionScreen() {
    const {state:authState} = useAuth();
    const {state:BookMark,dispatch} = useBookMark();
    const {userInfo} = authState;
    const {isLoading,error,Collection} = BookMark;

    const list_collections = async () =>{
                    dispatch({
                type:LIST_COLLECTION_REQUEST
            })
            try{
            const {data:{data}} = await API.get(`/collections`,{
                headers:{
                    Authorization:`${userInfo.token}`
                }
            })
                dispatch({
                    type:LIST_COLLECTION_SUCCESS,
                    payload:data
                })
            }catch(error){
                dispatch({
                    type:LIST_COLLECTION_FAIL,
                    payload:error.message
                })
            
            }  
                
        }  
        
    useEffect(() => {
            
    list_collections();       

    },[])
    
    return (
        <div className="container pageBook__Section_collection text-white">
            <h1>My Collection</h1>
            <div className="pageBook__Section text-white">
            <div className={'page-books justify-content-start pt-3'}>
            {isLoading ? <Loader/> : error ? <div>{error}</div> : Collection.length > 0  ?  Collection.map( (collection,index) => (
                <div className='card' key={index}>
                <Link to={`/detail/${collection.literatures.id}`}>
                    <img src={collection.literatures.cover}  className="card-img-top" alt="book"/>
                </Link>
                <div className="card-body text-white">
                    <h5 className="card-title">{collection.literatures.title}</h5>
                    <div className="card-content">
                        <p className="card-text">{collection.literatures.author}</p>
                        <p className="card-text">{collection.literatures.publication}</p>
                    </div>
                </div>
            </div>      
            )): <div>No Literature Available.</div> }
            </div>
        </div>   
        </div>    
    )
}

export default MyCollectionScreen
