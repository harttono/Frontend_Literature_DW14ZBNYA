import React,{useContext,createContext,useReducer} from 'react';
import Cookie from 'js-cookie';
import {USER_SIGNIN_REQUEST,USER_SIGNIN_SUCCESS,USER_SIGNIN_FAIL,USER_REGISTER_REQUEST,USER_REGISTER_SUCCESS,USER_REGISTER_FAIL,USER_LOGOUT, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL} from './constants/Constant';

const AuthContext = createContext();

const initialSate = {
    userInfo:null|| Cookie.getJSON('userInfo'),
    isLogin:false || Cookie.getJSON('isLogin'),
    isLoading:false,
    error:null
}

const reducer = (state,action) =>{
    switch(action.type){
        case USER_SIGNIN_REQUEST:
            return{
                ...state,
                isLoading:true,
            }       
        case USER_SIGNIN_SUCCESS:
            Cookie.set('userInfo',JSON.stringify({...action.payload}));
            Cookie.set('isLogin',JSON.stringify(true));
            return{
                ...state,
                userInfo:action.payload,
                isLogin:true,
                isLoading:false
            }
        case USER_SIGNIN_FAIL:
            return{
                ...state,
                isLoading:false,
                error:action.payload
            }
        case USER_REGISTER_REQUEST:
            return{
                ...state,
               isLoading:true
            }
        case USER_REGISTER_SUCCESS:
            Cookie.set('userInfo',JSON.stringify({...action.payload}));
            Cookie.set('isLogin',JSON.stringify(true));
            return{
                ...state,
                userInfo:action.payload,
                isLogin:true,
                isLoading:false
            }
        case USER_REGISTER_FAIL:
            return{
                ...state,
                error:action.payload,
                isLoading:false
            }
        case USER_LOGOUT:
            Cookie.remove('userInfo');
            Cookie.remove('isLogin');
            Cookie.remove('publication');
            return{
                ...state,
               userInfo:null,
               isLogin:false
            }
         case UPDATE_USER_REQUEST:
            return{
                ...state,
                isLoading:true,
            }       
        case UPDATE_USER_SUCCESS:
            let url = action.payload
            return{
                ...state,
                isLoading:false,
                userInfo:{...state.userInfo,picture:url}
            }
        case UPDATE_USER_FAIL:
            return{
                ...state,
                isLoading:false,
                error:action.payload
            }
        default : return state;
    }
}

export const AuthProvider = (props) =>{
    const [state,dispatch] = useReducer(reducer,initialSate);
    return(
        <AuthContext.Provider value={{state,dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

