import React,{createContext,useReducer,useContext} from 'react';
import {CHECK_BOOKMARK_REQUEST,CHECK_BOOKMARK_SUCCESS,CHECK_BOOKMARK_FAIL} from './constants/Constant'
export const BookMarkContext = createContext();

const initialState ={
    BookMarkData:[] 
}
const reducer = (state,action) =>{
    switch(action.type){
        case CHECK_BOOKMARK_REQUEST:
            return{
                ...state,
                isLoading:true,
            }
        case CHECK_BOOKMARK_SUCCESS:        
            return{
                ...state,
                isLoading:false,
                BookMarkData:action.payload
            }
        case CHECK_BOOKMARK_FAIL:
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