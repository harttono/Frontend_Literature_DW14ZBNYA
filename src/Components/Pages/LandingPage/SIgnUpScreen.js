import {API}from '../../../http';
import React,{useState,useEffect} from 'react';
import {Modal,Form,Spinner} from 'react-bootstrap';
import {useAuth} from '../../Provider/authProvider';
import {USER_REGISTER_REQUEST,USER_REGISTER_SUCCESS,USER_REGISTER_FAIL} from '../../Provider/constants/Constant';

function SignUp(props) {
    const {state,dispatch} = useAuth();
    const [info,setInfo] = useState('');
    const {error,isLoading} = state;
    const[formData,setFormData]=useState({
      email:'',
      password:'',
      fullname:'',
      gender:'',
      phone:'',
      address:''
    })
    
    // update state when handling changes
    const handleChange = (e) =>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
    const {email,password,fullname,gender,phone,address} = formData;
  
    const handleSubmit = async (e) =>{
      e.preventDefault();
      dispatch({
        type:USER_REGISTER_REQUEST,
      })
      try{
        const {data:{data}} = await API.post('/register',{...formData});
        dispatch({
          type:USER_REGISTER_SUCCESS,
          payload:data
        })
      }catch(error){
        dispatch({
          type:USER_REGISTER_FAIL,
          payload:error.response.data.message
        })
      }
      
    }


    if(info){
      setTimeout( () =>{
        setInfo('')
      },2500)
   }
  
  
    useEffect(() => {
    if(error){
        setInfo(error);
        dispatch({
          type:USER_REGISTER_FAIL,
          payload:null
        })
    }
    
    },[error])

    return (
      <>
        <button className="btn btn__primary" onClick={props.showModal}>
          Sign Up
        </button>
  
        <Modal show={props.showSignUp} onHide={props.closeModal} size='md' centered>
          <div className="form-header">
            <Modal.Header closeButton>
              <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
          </div> 
          <div className="form-section">
            <Modal.Body>
              <div className="form-content">
                <Form>
                    {info && <div className="flash_info">{info}</div>} 
                    <Form.Group>
                        <Form.Control type="email" name="email" placeholder="Email" autoComplete="true" value={email} onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="password" name="password" placeholder="Password" value={password} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" name="fullname" placeholder="Fullname" value={fullname} onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <select className="select-control" name="gender" value={gender} onChange={(e) => handleChange(e)}>
                          <option value="Select your gender">Select your gender</ option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" name="phone" placeholder="Phone" value={phone} onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <textarea className="textarea-control" name="address" rows="2"  placeholder="Address" value={address} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group>
                        <button className='btn-modal-signUp btn btn__primary outline-0 w-100' onClick={ (e) => handleSubmit(e)}>
                        {isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/> : null}
                          <span className="sr-only">{' '}</span> Sign Up
                        </button>
                    </Form.Group>
                    <Form.Group>
                        <div className='exclamation-text'>
                            Already have an account ? <button onClick={ props.openSignUpModal}>Click Here</button>   
                        </div>
                    </Form.Group>
                </Form>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </>
    );
}
    
export default SignUp;