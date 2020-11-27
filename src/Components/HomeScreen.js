import React,{useContext,useState,useEffect} from 'react'
import {BsSearch} from 'react-icons/bs';
import Loader from './Loader';
import {Link} from 'react-router-dom';
import {ProductContext} from './Provider/productProvider';
import {useBookMark} from './Provider/bookmarkProvider';
import {useAuth} from './Provider/authProvider';
import {LIST_PRODUCTS_REQUEST,LIST_PRODUCTS_SUCCESS,LIST_PRODUCTS_FAIL, 
        LIST_COLLECTION_REQUEST,LIST_COLLECTION_SUCCESS,LIST_COLLECTION_FAIL, 
        GET_PRODUCTS_BY_PUBLICATION_REQUEST,GET_PRODUCTS_BY_PUBLICATION_SUCCESS, GET_PRODUCTS_BY_PUBLICATION_FAIL} from './Provider/constants/Constant';
import {API} from '../http';


const HomeScreen = (props) => {
    const [state,dispatch] = useContext(ProductContext);
    const {dispatch:ACT} = useBookMark();
    const {state:authState} = useAuth();
    const {userInfo} = authState;
    const {isLoading,error,products} = state;
    const [title,setTitle] = useState('');
    const [year,setYear] = useState()
    const [flag,setFlag] = useState(false);
    const [searchBar,setSearchBar] = useState(false);
    const [date,setDate] = useState([]);


    const handleChange = (e) =>{
        let keyword = e.target.value.toLowerCase();
        setTitle(keyword)
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
        const {data:{data}} = await API.get('/literatures',{
            params:params,
            headers:{
                Authorization:`${userInfo.token}` 
            }
        })
        dispatch({
                type:LIST_PRODUCTS_SUCCESS,
                payload:data
        })
        console.log('isi data',data)
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
        
    // get date with removing duplicate date 
    if(date){
        var dateList = date.filter( (elem,index,self) => self.findIndex( t => t.publication === elem.publication) === index);
    }
 
    // check every literature which marked.
    useEffect(() => {
    let unmounted = false;
    const checkBookmarks = async () =>{
             ACT({
            type:LIST_COLLECTION_REQUEST
        })
        try{
        const {data:{data}} = await API.get(`/collections`,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            if(!unmounted){
                ACT({
                    type:LIST_COLLECTION_SUCCESS,
                    payload:data
                })
            }
        }catch(error){
            if(!unmounted){
                ACT({
                    type:LIST_COLLECTION_FAIL,
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
        const {data:{data}} = await API.get(`/getLiteratures`,{
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
        dispatch({
            type:LIST_PRODUCTS_SUCCESS,
            payload:null
        }) 
        dispatch({
            type:LIST_PRODUCTS_FAIL,
            payload:null
        })  
    }

    },[])
    
    return (
        <div className="container">
            <div className={ searchBar && products.length > 0 ?  "search_bar_left" : "search_bar"}>
                <div className='brand'>
                    { searchBar ?  "" : <img src='/asset/img/mediumBrand.svg'/>}
                </div>
                <div className="form-inline w-100 my-2 my-lg-0">
                    <input className="form-control mr-2 w-90" type="text" placeholder="Search" aria-label="Search" onChange = {e => handleChange(e)}/>
                    <button className="btn btn-outline-danger my-2 my-sm-0" type="submit" onClick={listProducts}><BsSearch/></button>
                </div>
            </div>
  
           <div className="main-menus">
                <div className="row">
                   {searchBar && <div className="col-2 page-left">
                    <label>Anytime</label>
                    <select className="custom-select" onChange ={e => setYear(e.target.value)}>
                        <option >By Year</option>
                        {dateList && dateList.map( (date,index) => (
                        <option value={date.publication} key={index}>{date.publication}</option> ))}
                    </select>
                    </div>}
                    <div className="col-10 page-books text-white">
                    {error && <div className={searchBar ? "text-center alert alert-warning w-100 mt-4" : " results" }>{error}</div> }
            
                    {isLoading ? <Loader/> : products ?  products.map( (book,index)=> (
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