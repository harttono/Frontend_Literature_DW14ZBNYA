import React,{useState,useEffect} from 'react'
import {MdLocalPostOffice} from 'react-icons/md';
import {FaTransgender,FaPhoneAlt,FaMapMarkerAlt} from 'react-icons/fa';
import {useAuth} from './Provider/authProvider';
import { UPDATE_USER_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS} from './Provider/constants/Constant';
import Axios from 'axios';
import MyLiterature from './MyLiteratureScreen';
import Fileuploader from './FileUploadScreen';

function Profile() {
    const {state:authData,dispatch} = useAuth();
    const {isLoading,error,userInfo,info} = authData;
    const [show,setShow] = useState(false);
    const [disableText,setDisableText] = useState(true);
    const [dataProfile,setDataProfile] = useState({});
    const [urlProfile,setUrlProfile] = useState('');
    const [newUrlPicture,setNewUrlPicture] = useState('');
    const [updated,setUpdated] = useState(false);
    const [message,setMessage] = useState('');
   
    let urls = JSON.parse(localStorage.getItem('url')) || [];

    // update profile 
    const onUpdated = async (userId) => {

        const updateData = {
            picture:urlProfile
        }
            dispatch({
                type:UPDATE_USER_REQUEST
            })
        try{    
        const {data:{picture}} = await Axios.patch(`/api/v1/user/${userId}`,updateData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:UPDATE_USER_SUCCESS,
                payload:picture,
            })
            if(picture){
                setNewUrlPicture(picture)
            }
        }catch(err){
            dispatch({
                type:UPDATE_USER_FAIL,
                payload:err.response.data.message
            })
        }
        setUpdated(false);
    }


    // get url response
    if(urls.length > 0){
        setUrlProfile(urls[0].url);
        localStorage.removeItem('url');
    }

      
    // modal handler
    const openModal = () =>{
        setShow(true);
    }
    const closeModal = () =>{
        setShow(false);
        setUpdated(true);
    }


    useEffect(() => {
        
        // set data when the first rendering..
        if(userInfo){
            setNewUrlPicture(userInfo.picture);
            setDataProfile(userInfo);
        }
         
        // update picture when state changes
        if(newUrlPicture){
            setNewUrlPicture(newUrlPicture);
        }
        return () =>{
            setNewUrlPicture(null)
        }
    },[newUrlPicture])
   
        return (
                 <div className='container text-white'> 
                    <div className="profile__page-bg">
                        <h1>Profile</h1>
                            {dataProfile ? dataProfile &&
                            <div className='profile__page_container my-4'>
                                <ul className="list-group profile__page_info">
                                    <li className="list-group-item flex-profile-info">
                                        <div className="profile__icon_info">
                                            <span><MdLocalPostOffice/></span>
                                        </div>
                                        <div>
                                            <h5>{dataProfile.email}</h5>
                                            <p>Email</p>
                                        </div>
                                    </li>
                                    <li className="list-group-item flex-profile-info">
                                        <div className="profile__icon_info">
                                            <span><FaTransgender/></span>
                                        </div>
                                        <div>
                                            <h5>{dataProfile.gender}</h5>
                                            <p>Gender</p>
                                        </div>
                                    </li>
                                    <li className="list-group-item flex-profile-info">
                                        <div className="profile__icon_info">
                                            <span><FaPhoneAlt/></span>
                                        </div>
                                        <div>
                                            <h5>{dataProfile.phone}</h5>
                                            <p>Mobile Phone</p>
                                        </div>
                                    </li>
                                    <li className="list-group-item flex-profile-info">
                                        <div className="profile__icon_info">
                                            <span><FaMapMarkerAlt/></span>
                                        </div>
                                        <div>
                                            <h5>{dataProfile.address}</h5>
                                            <p>Address</p>
                                        </div>
                                    </li>  
                                </ul>
                                <div className=" profile__page_picture">
                                    <div className="card card-profile">
                                        <img src={newUrlPicture} className="card-img-top" alt="..."/>
                                        <div className="card-body">
                                            {updated ? <button className="btn btn-success w-100" onClick={ () => onUpdated(dataProfile.id)}>save</button> :  <button class="btn btn-danger w-100" onClick={openModal}>Change your profile</button>}
                                            <Fileuploader show={show} able={disableText} closeModal={closeModal}/>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            :null}
                        <h1>My Literature</h1>
                        <MyLiterature/>
                    </div>
                </div>
        )
}

export default Profile
