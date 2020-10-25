import React,{useContext,useState,useEffect} from 'react'
import {BsSearch} from 'react-icons/bs';
import Loader from './Loader';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import {ProductContext} from './Provider/productProvider';
import {useBookMark} from './Provider/bookmarkProvider';
import {useAuth} from './Provider/authProvider';
import {LIST_PRODUCTS_REQUEST,LIST_PRODUCTS_SUCCESS,LIST_PRODUCTS_FAIL, 
        CHECK_BOOKMARK_REQUEST,CHECK_BOOKMARK_SUCCESS,CHECK_BOOKMARK_FAIL, 
        GET_PRODUCTS_BY_PUBLICATION_REQUEST,GET_PRODUCTS_BY_PUBLICATION_SUCCESS, GET_PRODUCTS_BY_PUBLICATION_FAIL} from './Provider/constants/Constant';



const HomeScreen = (props) => {
    const [state,dispatch] = useContext(ProductContext);
    const {state:BookMark,dispatch:ACT} = useBookMark();
    const {isLoading:loading,error:errorBookMark,BookMarkData}  = BookMark;
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const {isLoading,error,products} = state;
    const [title,setTitle] = useState('');
    const [year,setYear] = useState()
    const [flag,setFlag] = useState(false);
    const [searchBar,setSearchBar] = useState(false);
    const [date,setDate] = useState([]);


    const handleChange = (e) =>{
        setTitle(e.target.value);
        setFlag(false);
    }
    
    var params 
    if (flag){
        params = {
            title:title,
            publication:year
        }  
    }else{  
        params = {
            title:title
        }
    }

    
    // list of products
    const listProducts = async () =>{
        dispatch({
            type:LIST_PRODUCTS_REQUEST
        })
    try{

        const {data:{data}} = await Axios.get('/api/v1/books',{
            params:params,
            headers:{
                Authorization:`${userInfo.token}` 
            }
        })
      
        dispatch({
                type:LIST_PRODUCTS_SUCCESS,
                payload:data
        })
        if(data){
            setSearchBar(true);
        }
      
    }catch(error){
            dispatch({
                type:LIST_PRODUCTS_FAIL,
                payload:error.response.data.message
            })

        }
    }
        
    const readHandler = (id) =>{
        props.history.push(`/read/${id}`)
    }
    

    // get date with removing duplicate 
    if(date){
        var dateList = date.filter( (elem,index,self) => self.findIndex( t => t.publication === elem.publication) === index);
    }

    useEffect(() => {
    let unmounted = false;
    const checkBookmarks = async () =>{
             ACT({
            type:CHECK_BOOKMARK_REQUEST
        })
        try{
        const {data:{data}} = await Axios.get(`/api/v1/bookmarks`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            if(!unmounted){
                ACT({
                    type:CHECK_BOOKMARK_SUCCESS,
                    payload:data
                })
            }
        }catch(error){
            if(!unmounted){
                ACT({
                    type:CHECK_BOOKMARK_FAIL,
                    payload:error.response.data.message
                })
            }
        }  
            
    } 

    checkBookmarks();
   
    const getProducts = async () =>{
                dispatch({
            type:GET_PRODUCTS_BY_PUBLICATION_REQUEST
        })
        try{
        const {data:{data}} = await Axios.get(`/api/v1/getbooks`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
           if(!unmounted){
                dispatch({
                    type:GET_PRODUCTS_BY_PUBLICATION_SUCCESS,
                    payload:data
                })
                if(data){
                    setDate(data);
                }
           }
        }catch(error){
            if(!unmounted){
                dispatch({
                    type:GET_PRODUCTS_BY_PUBLICATION_FAIL,
                    payload:error.response.data.message
                })
            }
        
        }           
    } 

    getProducts();  
    if(year){
        setFlag(true);
    }
    
    // clean up global state
    return () => {
        unmounted = false;
        dispatch({
            type:LIST_PRODUCTS_SUCCESS,
            payload:null
        })  
    }

    },[year])
    
    return (
        <div className="container">
            <div className="row">
                <div className={ searchBar ?  "search_bar_left" : "search_bar"}>
                    <div className='brand'>
                    { searchBar ?  "" : <img src='/asset/img/mediumBrand.svg'/>}
                    </div>
                    <div className="form-inline w-100 my-2 my-lg-0">
                        <input className="form-control mr-2 w-90" type="text" placeholder="Search" aria-label="Search" onChange = {e => handleChange(e)}/>
                        <button className="btn btn-outline-danger my-2 my-sm-0" type="submit" onClick={listProducts}><BsSearch/></button>
                    </div>
                </div>
            </div>
           <div className="main-menus">
                <div className="row">
                   {searchBar && <div className="col-2 page-left">
                    <label>Anytime</label>
                    <select className="custom-select" onChange ={e => setYear(e.target.value)}>
                        <option >By Year</option>
                        {dateList && dateList.map( date => (
                        <option value={date.publication}>{date.publication}</option> ))}
                    </select>
                    </div>}
                    <div className="col-10 page-books text-white">
            
                    { isLoading ? <Loader/> : error ? <div className={searchBar ? "text-center alert alert-warning w-100 mt-4" : " results" }>{error}</div> : products ?  products.map( (book,index)=> (
                            <div className='card' key={index}>
                            <Link to={`/detail/${book.id}`}>
                                <img src={book.cover}  className="card-img-top" alt="book"/>
                            </Link>
                            <div className="card-body text-white">
                                <h5 className="card-title">{book.title}</h5>
                                <div className="card-content">
                                    <p className="card-text">{book.author}</p>
                                    <p className="card-text">{book.publication}</p>
                                </div>
                                <button className="btn btn-secondary btn-floating" onClick={ () => readHandler(book.id)}>Read</button>
                            </div>     
                        </div>                
                    )): null}
                    </div>
                </div>
                
           </div>
        </div>
    )
}
export default HomeScreen