import React  from 'react';
import {Redirect,Route} from 'react-router-dom';
import {useAuth} from './Provider/authProvider';

const PrivateRoutes = ({component:Component,...rest}) => {
    const {state} = useAuth();
    return (
        <Route {...rest} render ={ props => (
            state.isLogin ?  <Component {...props}/> : <Redirect to='/'/>
         )}/>
    )
}


export default PrivateRoutes
