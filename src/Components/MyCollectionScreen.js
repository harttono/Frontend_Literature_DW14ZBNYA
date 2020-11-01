import React,{useContext,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Loader from './Loader';
import {useAuth} from './Provider/authProvider';
import {useBookMark} from './Provider/bookmarkProvider'
import {CHECK_BOOKMARK_REQUEST,CHECK_BOOKMARK_SUCCESS,CHECK_BOOKMARK_FAIL} from './Provider/constants/Constant';
import {API} from '../http';

function MyCollectionScreen() {
    const {state:authState} = useAuth();
    const {state:BookMark,dispatch} = useBookMark();
    const {userInfo} = authState;
    const {isLoading,error,BookMarkData} = BookMark;
 
    const checkBookmarks = async () =>{
                    dispatch({
                type:CHECK_BOOKMARK_REQUEST
            })
            try{
            const {data:{data}} = await API.get(`/bookmarks`,{
                headers:{
                    Authorization:`${userInfo.token}`
                }
            })
                dispatch({
                    type:CHECK_BOOKMARK_SUCCESS,
                    payload:data
                })
            }catch(error){
                dispatch({
                    type:CHECK_BOOKMARK_FAIL,
                    payload:error.response.data.message
                })
            
            }  
                
        }  
    useEffect(() => {
            
    checkBookmarks();       
    }, [])
    
    return (
        <div className="container pageBook__Section_collection text-white">
            <h1>My Collection</h1>
            <div className="pageBook__Section text-white">
            <div className={'page-books justify-content-start pt-3'}>
            {isLoading ? <Loader/> : error ? <div>{error}</div> : BookMarkData.length > 0  ?  BookMarkData.map( (collection,index) => (
                <div className='card' key={index}>
                <Link to={`/detail/${collection.books.id}`}>
                    <img src={collection.books.cover}  className="card-img-top" alt="book"/>
                </Link>
                <div className="card-body text-white">
                    <h5 className="card-title">{collection.books.title}</h5>
                    <div className="card-content">
                        <p className="card-text">{collection.books.author}</p>
                        <p className="card-text">{collection.books.publication}</p>
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
