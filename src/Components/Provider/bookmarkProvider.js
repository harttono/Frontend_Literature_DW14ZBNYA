import React,{createContext,useReducer,useContext} from 'react';
import {LIST_COLLECTION_REQUEST,LIST_COLLECTION_SUCCESS,LIST_COLLECTION_FAIL} from './constants/Constant'
export const BookMarkContext = createContext();

const initialState ={
    Collection:[] 
}
const reducer = (state,action) =>{
    switch(action.type){
        case LIST_COLLECTION_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case LIST_COLLECTION_SUCCESS:        
            return{
                ...state,
                isLoading:false,
                Collection:action.payload
            }
        case LIST_COLLECTION_FAIL:
            return{
                ...state,
                isLoading:false,
                erorr:action.payload
            }
        default :
            return state;
    }
}

export const BookMarkContextProvider = props =>{
    const[state,dispatch] = useReducer(reducer,initialState)
    return(
        <BookMarkContext.Provider value={{state,dispatch}}>
            {props.children}
        </BookMarkContext.Provider>
    )
}


export const useBookMark = () => useContext(BookMarkContext);