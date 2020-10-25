import React,{useState,useEffect} from 'react';
import {Modal,Button,Form,Spinner} from 'react-bootstrap';
import {useAuth} from '../../Provider/authProvider';
import {USER_SIGNIN_REQUEST,USER_SIGNIN_FAIL, USER_SIGNIN_SUCCESS} from '../../Provider/constants/Constant';
import Axios from 'axios';

function SignIn(props) {
    const {state,dispatch} = useAuth();
    const {error,isLoading} = state;
    const [info,setInfo]=useState('');
    const [formData,setformData] = useState({
      email:'',
      password:''
    })
    
    // update state when handling changes
    const handleChange = (e) =>{
      setformData({...formData,[e.target.name] : e.target.value});
    }
    const {email,password} = formData;

    const handleSubmit = async (e) =>{
      e.preventDefault();
      dispatch({
        type:USER_SIGNIN_REQUEST
      })
    try{
        const {data:{data}} = await Axios.post('api/v1/login',{email,password});
      dispatch({
        type:USER_SIGNIN_SUCCESS,
        payload:data
      })
    }catch(error){
      dispatch({
        type:USER_SIGNIN_FAIL,
        payload:error.response.data.message
      })
    }
  }

  useEffect(() => {
    if(error){
      setInfo(error);
    }
    setTimeout( () =>{
      setInfo('')
    },2000)
  }, [])
   
  return (
      <>
        <button  className="btn btn__secondary" onClick={props.showModal}>
          Sign In
        </button>
  
        <div>
          <Modal show={props.showSignIn} onHide={props.closeModal} size='md' centered>
          <div className="form-header">
            <Modal.Header closeButton>
              <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
          </div>
            <div className="form-section">
              <Modal.Body>
                <div className="form-content">
                    <Form>
                      <Form.Group>
                      {error && <div className="flash_info">{error}</div> } 
                      </Form.Group>
                      <Form.Group>
                          <Form.Control type="email" placeholder="Email" name="email" value={email} onChange={e => handleChange(e)} />
                      </Form.Group>
                      <Form.Group>
                          <Form.Control type="password" placeholder="Password" autoComplete="true" name="password" value={password} onChange={e => handleChange(e)}/>
                      </Form.Group>
                      <Form.Group>
                          <button className="btn btn-danger outline-0 w-100" onClick={ (e) => handleSubmit(e)} > Sign In</button>
                      </Form.Group>
                      <Form.Group>
                          <div className='exclamation-text'>
                              Dont't have an account ? 
                              <button onClick={props.openSignInModal}>
                                  Click Here
                              </button>    
                          </div>
                      </Form.Group>
                    </Form>
                </div>
              </Modal.Body>
            </div>
        </Modal>
        </div>
      </>
    );
}
    
export default SignIn;