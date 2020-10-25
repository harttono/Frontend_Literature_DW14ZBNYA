import React,{createContext,useReducer,useContext} from 'react';
import { LIST_PRODUCTS_USER_REQUEST, LIST_PRODUCTS_USER_SUCCESS, LIST_PRODUCTS_USER_FAIL,
         UPDATE_PRODUCT_USER_REQUEST, UPDATE_PRODUCT_USER_SUCCESS, UPDATE_PRODUCT_USER_FAIL, LIST_CATEGORY_REQUEST, LIST_CATEGORY_SUCCESS, LIST_CATEGORY_FAIL, REMOVE_CATEGORY_REQUEST, REMOVE_CATEGORY_SUCCESS, REMOVE_CATEGORY_FAIL, ADD_CATEGORY_REQUEST, ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAIL} from './constants/Constant'

export const AdminProductContext = createContext();

const initialState ={
    Products:[],
    updatedProduct:[],
    categories:[],
    category:{},
    onDeleted:{}
}
const reducer = (state,action) =>{
    switch(action.type){
        case LIST_PRODUCTS_USER_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case LIST_PRODUCTS_USER_SUCCESS:
            return{
                ...state,
                isLoading:false,
                Products:action.payload
            }
        case LIST_PRODUCTS_USER_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            } 
        case UPDATE_PRODUCT_USER_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case UPDATE_PRODUCT_USER_SUCCESS:
            return{
                ...state,
                isLoading:false,
                updateProduct:action.payload
            }
        case UPDATE_PRODUCT_USER_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            } 
        case LIST_CATEGORY_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case LIST_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                categories:action.payload
            }
        case LIST_CATEGORY_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            } 
         case REMOVE_CATEGORY_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case REMOVE_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                onDeleted:action.payload
            }
        case REMOVE_CATEGORY_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            } 
        case ADD_CATEGORY_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case ADD_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                category:action.payload
            }
        case ADD_CATEGORY_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            } 
        default :
            return state;
    }
}

export const AdminProductProvider = props =>{
    const[state,dispatch] = useReducer(reducer,initialState)
    return(
        <AdminProductContext.Provider value={[state,dispatch]}>
            {props.children}
        </AdminProductContext.Provider>
    )
}


