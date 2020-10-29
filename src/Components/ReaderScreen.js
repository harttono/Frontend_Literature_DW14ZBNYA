import React,{useContext,useEffect,useState} from "react";
import Loader from './Loader';
import Axios from 'axios';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Document,Page} from 'react-pdf/dist/esm/entry.webpack';
import {DETAIL_PRODUCT_REQUEST,DETAIL_PRODUCT_SUCCESS,DETAIL_PRODUCT_FAIL} from './Provider/constants/Constant';
import {ProductContext} from './Provider/productProvider';
import {useAuth} from './Provider/authProvider';
function BookViewer(props){
  const [state,dispatch] = useContext(ProductContext);
  const {isLoading,error,detailProduct}  = state;
  const {id} = props.match.params;
  const {state:authData} = useAuth();
  const {userInfo} = authData;

  useEffect(() => {
    const listDetailProduct = async () =>{
            dispatch({
                type:DETAIL_PRODUCT_REQUEST
            })
        try{
            const {data:{data}} = await Axios.get(`/api/v1/book/${id}`,{
                headers:{
                    Authorization:`${userInfo.token}`
                }
            })
                dispatch({
                    type:DETAIL_PRODUCT_SUCCESS,
                    payload:data
                })
          }catch(error){
            console.log('isi error')
                dispatch({
                    type:DETAIL_PRODUCT_FAIL,
                    payload:error.response.data.message
                })
            
        }
    }
  
   listDetailProduct();  
}, [])
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    document.addEventListener("contextmenu", (event) => { 
        event.preventDefault(); 
      }); 

    function onDocumentLoadSuccess({ numPages }) { 
        setNumPages(numPages); 
        setPageNumber(1); 
      } 
      
      function changePage(offset) { 
        setPageNumber(prevPageNumber => prevPageNumber + offset); 
      } 
      
      function previousPage() { 
        changePage(-1); 
      } 
      
      function nextPage() { 
        changePage(1); 
    } 
      
    return (
        <div className="container document-reader text-white">
              {isLoading ? <Loader/> : error ? <div>{error}</div> : detailProduct ? 
              detailProduct.map( book => (
              <div key={book.id}>
                    <Document file={book.attachment} onLoadSuccess={onDocumentLoadSuccess}  options={{ workerSrc: "/pdf.worker.js" }} className="document">
                      <Page pageNumber={pageNumber} scale={1.5}/>
                    </Document>
               
                
                  <div className="pt-2 reader-btn"> 
                      <div> Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'} </div>  
                      <div>
                        <button type="button" className="btn btn-primary mx-2" disabled={pageNumber <= 1} onClick={previousPage}> Previous </button>
                        <button type="button"  className="btn btn-secondary mx-2" disabled={pageNumber >= numPages} onClick={nextPage}> Next </button> 
                      </div>
                  </div> 
              </div>
              )): null}
        </div>
    );
}
export default BookViewer


