import React,{useEffect,useContext, useState} from 'react';
import Axios from 'axios';
import {BiBookmark,BiCloudDownload} from 'react-icons/bi';
import {useHistory} from 'react-router-dom';
import {MdDeleteForever} from 'react-icons/md';
import {ProductContext} from './Provider/productProvider';
import {useBookMark} from './Provider/bookmarkProvider';
import {useParams} from 'react-router-dom';
import {useAuth} from './Provider/authProvider';
import Loader from './Loader';
import {Modal} from 'react-bootstrap';
import {DETAIL_PRODUCT_REQUEST,DETAIL_PRODUCT_SUCCESS,DETAIL_PRODUCT_FAIL,
        DELETE_PRODUCT_REQUEST,DELETE_PRODUCT_SUCCESSS,DELETE_PRODUCT_FAIL,
        ADD_BOOKMARK_REQUEST,ADD_BOOKMARK_SUCCESS,ADD_BOOKMARK_FAIL,
        REMOVE_BOOKMARK_REQUEST, REMOVE_BOOKMARK_SUCCESS, REMOVE_BOOKMARK_FAIL} from './Provider/constants/Constant';
import {API} from '../http';

const DetailScreen = (props) => {

    const [DeletedModal,ShowDeletedModal] = useState(false);
    const {id} = useParams();
    const {state:authData} = useAuth();
    const [state,dispatch] = useContext(ProductContext);
    const {state:BookMark} = useBookMark();
    const {Collection}  = BookMark;
    const {userInfo} = authData;
    const {isLoading,error,detailProduct}  = state;
    const [marked,setMarked] = useState(false);
  
    const closeDeletedModal = () => ShowDeletedModal(false);
    
    const openDeletedModal = () => ShowDeletedModal(true);
    

    // list detail book
    const listDetailProduct = async (props) =>{
        dispatch({
                type:DETAIL_PRODUCT_REQUEST
            })
        try{
            const {data:{data}} = await API.get(`/literature/${id}`,{
                 headers:{
                    Authorization:`${userInfo.token}`
                }
            })
            dispatch({
                    type:DETAIL_PRODUCT_SUCCESS,
                    payload:data
                })
        }catch(error){
            dispatch({
                    type:DETAIL_PRODUCT_FAIL,
                    payload:error.response.data.message
                })
                
        }
    } 
    

    //add bookmark
    const addBookmark = async (literatureId) => {
        const userId = userInfo.id;
            dispatch({
                type:ADD_BOOKMARK_REQUEST
            })
        try{    
        const {data:{data}} = await API.get(`/collection?userId=${userId}&literatureId=${literatureId}`,{
            headers:{
                authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:ADD_BOOKMARK_SUCCESS,
                payload:data
            })
            if(data){
                props.history.push('/mycollection')
            }
        }catch(err){
            dispatch({
                type:ADD_BOOKMARK_FAIL,
                payload:err.response.data.message
            })
        }    
    }   

     //remove bookmark
    const removeBookmark = async (bookId) =>{
            dispatch({
                type:REMOVE_BOOKMARK_REQUEST
            })
        try{    
        const {data:{data}} = await API.delete(`/collection/${bookId}`,{
            headers:{
                authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:REMOVE_BOOKMARK_SUCCESS,
                payload:data
            })
            if(data){
                props.history.push('/mycollection')
            }
        }catch(err){
            dispatch({
                type:REMOVE_BOOKMARK_FAIL,
                payload:err.response.data.message
            })
        }    
    }   
   
    //download file
    const downloadFiles = async (filename) =>{
       await Axios({
            url: `${filename}`,
            method: 'GET',
            responseType: 'blob',
            }).then((response) => {
             var fileURL = window.URL.createObjectURL(new Blob([response.data]));
             var fileLink = document.createElement('a');
             fileLink.href = fileURL;
             fileLink.setAttribute('download', `${filename}`);
             document.body.appendChild(fileLink);
             fileLink.click();
        });    

    }
    
    useEffect(() => {
    listDetailProduct();   

    if(Collection.length > 0){
        const checkBookMark = Collection.some( mark => mark.literatures.id == id );
        setMarked(checkBookMark);
    }
   
    },[Collection])

        return (
         
            <div className="container">
                <div className="detailBook">
                {isLoading ? <Loader/> : error ? <div>{error}</div> : detailProduct &&
                detailProduct.map( literature => (
                        <div className="row detail__book-section" key={literature.id}>
                            <div className="col-4  detail__book-img ">
                           <img src={literature.cover}   alt="Detail Book"/>
                            </div>
                            <div className="col-5 pb-4 detail__info-book">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <h1>{literature.title}</h1>
                                        <p>{literature.author}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h3>Publication Date</h3>
                                        <p>{literature.publication}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h3>Pages</h3>
                                        <p>{literature.pages}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h3>ISBN</h3>
                                        <p>{literature.ISBN}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <button className="detail-book-addbtn btn__primary p-2" onClick={() => downloadFiles(literature.attachment)}>Download. <BiCloudDownload/></button>
                                    </li>
                                </ul>    
                            </div>   
                            <div className="col-3">
                                <div className="detail-btn">
                                    { literature.userId.id == userInfo.id ?
                                        <button className='detail-book-addbtn btn__primary' onClick={openDeletedModal}>
                                            <span>Delete</span><MdDeleteForever/>
                                        </button>: marked ? 
                                        <button className='detail-book-addbtn btn__primary' onClick={() => removeBookmark(literature.id)}>
                                                <span>Remove</span><BiBookmark/> 
                                        </button> :
                                        <button className='detail-book-addbtn btn__primary' onClick={ () => addBookmark(literature.id)}>
                                                <span>Add To Collection</span><BiBookmark/>
                                        </button>
                                    }
                                </div>                         
                                <DeletedMessage show={DeletedModal} onHide={closeDeletedModal}   bookId={id} title={literature.title}/>
                            </div> 
                        </div>
                    ))}
                </div>
            </div>
        )
}

export default DetailScreen;




// delete literature 
function DeletedMessage(props) {
    const {state:authData} = useAuth();
    const {userInfo} = authData;
    const [state,dispatch] = useContext(ProductContext);
    const history = useHistory();

    const removeBook = async (productId) =>{
        let action = false;
            dispatch({
            type:DELETE_PRODUCT_REQUEST
        })
    try{
        const {data:{message}} = await API.delete(`/literature/${productId}`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
        dispatch({
            type:DELETE_PRODUCT_SUCCESSS,
            payload:message
        }) 
        if(message){
            action = true;  
        }
    }catch(error){
        dispatch({
            type:DELETE_PRODUCT_FAIL,
            payload:error
        })
    }   
        if(action){
            history.push('/profile');
        }
    
    }

    return (
      <>
        <Modal show={props.show} onHide={props.onHide}>
            <div className="messageBox">
                <div>
                    <p className="text-center">Do you want to delete <b>{props.title}</b> ??</p>
                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-danger w-25 mx-2" onClick={props.onHide}>No</button>{" "}
                        <button className="btn btn-success w-25 mx-2" onClick={ () => removeBook(props.bookId)}>Yes</button>
                    </div>
                </div>
            </div>
        </Modal>
      </>
    );
  }