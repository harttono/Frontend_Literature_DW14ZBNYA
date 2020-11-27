import React,{useState,useEffect} from 'react';
import './LandingPage.css';
import {useAuth} from '../../Provider/authProvider';
import Brand from '../../BrandScreen';
import SignIn from './SignInScreen';
import SignUp from './SIgnUpScreen';

function LandingPage(props) {
    const {state} = useAuth();
    const {userInfo,isLogin} = state;
    const[signIn,setSignIn]=useState(false);
    const[signUp,setSignUp]=useState(false);

    // handler for sign up modal
    const openSignUpModal = (e) => {
        e.preventDefault();
        setSignIn(true);
        setSignUp(false);
    }
    // handler for sign in modal
    const openSignInModal = (e) =>{
        e.preventDefault();
        setSignUp(true);
        setSignIn(false);
    }
  

    useEffect(() => {
            if(isLogin && !userInfo.isAdmin){
                props.history.push('/home')
            }else if(isLogin && userInfo.isAdmin){
                props.history.push('/admin')
            }
    },[userInfo])
    return (
        <div className="LandingPage-container">
            <div className="row">
                <div className='d-flex flex-column justify-content-start banner-text col-md-5'>
                    <div className="brand-wrapper">
                        <Brand/>
                    </div>
                    <div className="banner-text-heading">
                        <h1>source  of</h1>
                        <h1>intellingence</h1>
                    </div>    
                    <div className="banner-text-paragraf">
                        <p>
                            Sign-up and receive unlimited accesss to all of your literature - share your literature.
                        </p>
                    </div>
                    <div className='banner-button'>
                        <div className="signUp-btn">
                            <SignUp showModal={() => setSignUp(true)} 
                            showSignUp={signUp} closeModal={()=>setSignUp(false)} 
                            openSignUpModal={openSignUpModal}/>
                        </div>
                        <div className='signIn-btn'>
                            <SignIn showModal={() => setSignIn(true)} 
                            showSignIn={signIn} 
                            closeModal={() => setSignIn(false)} 
                            openSignInModal={openSignInModal}/> 
                        </div>
                    </div>
                </div>
                <div className='banner-content col-md-7'>
                    <img src='/asset/img/bgBanner.svg' alt='bg-banner'/>
                </div>
            </div>
        </div>    
       
    )
}

export default LandingPage
