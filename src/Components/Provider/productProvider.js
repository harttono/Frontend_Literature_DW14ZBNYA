import React,{createContext,useReducer,useContext} from 'react';
import Cookie from 'js-cookie';
import {LIST_PRODUCTS_REQUEST, LIST_PRODUCTS_SUCCESS, 
        LIST_PRODUCTS_FAIL,DETAIL_PRODUCT_REQUEST, DETAIL_PRODUCT_SUCCESS,
        DETAIL_PRODUCT_FAIL,LIST_CATEGORY_REQUEST, LIST_CATEGORY_SUCCESS,
        LIST_CATEGORY_FAIL,LIST_MYPRODUCTS_REQUEST,LIST_MYPRODUCTS_SUCCESS,
        LIST_MYPRODUCTS_FAIL, ADD_PRODUCT_REQUEST, ADD_PRODUCT_SUCCESS,
        ADD_PRODUCT_FAIL,GET_PRODUCTS_BY_CATEGORY_REQUEST,
        GET_PRODUCTS_BY_CATEGORY_SUCCESS,GET_PRODUCTS_BY_CATEGORY_FAIL,
        DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESSS, DELETE_PRODUCT_FAIL, 
        MY_PRODUCTS_REQUEST, MY_PRODUCTS_SUCCESS, MY_PRODUCTS_FAIL,
        ADD_BOOKMARK_REQUEST,ADD_BOOKMARK_SUCCESS,ADD_BOOKMARK_FAIL,
        REMOVE_BOOKMARK_REQUEST, REMOVE_BOOKMARK_SUCCESS,REMOVE_BOOKMARK_FAIL,
        GET_PRODUCTS_BY_PUBLICATION_REQUEST,GET_PRODUCTS_BY_PUBLICATION_SUCCESS, GET_PRODUCTS_BY_PUBLICATION_FAIL} from './constants/Constant';

export const ProductContext = createContext();

const initialState ={
    publication:[] || Cookie.getJSON('publication')
}
const reducer = (state,action) =>{
    switch(action.type){
        case LIST_PRODUCTS_REQUEST:
            return{
                isLoading:true
            }
        case LIST_PRODUCTS_SUCCESS:
            return{
                products:action.payload,
                isLoading:false
            }
        case LIST_PRODUCTS_FAIL:
            return{
                error:action.payload,
                isLoading:false
            }
        case DETAIL_PRODUCT_REQUEST:
            return{
                isLoading:true
            }
        case DETAIL_PRODUCT_SUCCESS:
            return{
                isLoading:false,
                detailProduct:[{...action.payload}]
            }
            
        case DETAIL_PRODUCT_FAIL:
            return{
                error:action.payload,
                isLoading:false
            }
        case LIST_CATEGORY_REQUEST:
            return{
                isLoading:true
            }
        case LIST_CATEGORY_SUCCESS:
            return{
                isLoading:false,
                listCategory:action.payload
            }
        case LIST_CATEGORY_FAIL:
            return{
                isLoading:false,
                error:action.payload
            }
        case LIST_CATEGORY_REQUEST:
            return{
                isLoading:true
            }
        case LIST_CATEGORY_SUCCESS:
            return{
                isLoading:false,
                listCategory:action.payload
            }
       case LIST_CATEGORY_FAIL:
            return{
                isLoading:false,
                error:action.payload
            }
        case LIST_MYPRODUCTS_REQUEST:
            return{
                isLoading:true
            }
        case LIST_MYPRODUCTS_SUCCESS:
            return{
                isLoading:false,
                myLibrary:action.payload
            }
        case LIST_MYPRODUCTS_FAIL:
            return{
                isLoading:false,
                error:action.payload
            }
        case ADD_PRODUCT_REQUEST:
            return{
                isLoading:true,
            }
        case ADD_PRODUCT_SUCCESS:
            return{
                isLoading:false,
                newBook:action.payload
            }
        case ADD_PRODUCT_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case GET_PRODUCTS_BY_CATEGORY_REQUEST:
            return{
                isLoading:true,
            }
        case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
            return{
                isLoading:false,
                categories:action.payload
            }
        case GET_PRODUCTS_BY_CATEGORY_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case MY_PRODUCTS_REQUEST:
            return{
                isLoading:true,
            }
        case MY_PRODUCTS_SUCCESS:
            return{
                isLoading:false,
                myLiterature:action.payload
            }
        case MY_PRODUCTS_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case DELETE_PRODUCT_REQUEST:
            return{
                isLoading:true,
            }
        case DELETE_PRODUCT_SUCCESSS:
            return{
                isLoading:false,
                deletedProduct:action.payload
            }
        case DELETE_PRODUCT_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case ADD_BOOKMARK_REQUEST:
            return{
                isLoading:true,
            }
        case ADD_BOOKMARK_SUCCESS:
            return{
                isLoading:false,
                Bookmark:action.payload
            }
        case ADD_BOOKMARK_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case REMOVE_BOOKMARK_REQUEST:
            return{
                isLoading:true,
            }
        case REMOVE_BOOKMARK_SUCCESS:
            return{
                isLoading:false,
                removed:action.payload
            }
        case REMOVE_BOOKMARK_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        case GET_PRODUCTS_BY_PUBLICATION_REQUEST:
            return{
                isLoading:true,
            }
        case GET_PRODUCTS_BY_PUBLICATION_SUCCESS:
            Cookie.set('publication',JSON.stringify({...action.payload}))
            return{
                isLoading:false,
                publication:action.payload
            }
        case GET_PRODUCTS_BY_PUBLICATION_FAIL:
            return{
                isLoading:false,
                erorr:action.payload
            }
        default :
            return state;
    }
}

export const ProductContextProvider = props =>{
    const[state,dispatch] = useReducer(reducer,initialState)
    return(
        <ProductContext.Provider value={[state,dispatch]}>
            {props.children}
        </ProductContext.Provider>
    )
}


