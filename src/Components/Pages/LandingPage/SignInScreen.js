import React,{useState,useEffect} from 'react';
import {API}from '../../../http';
import {Modal,Form,Spinner,InputGroup} from 'react-bootstrap';
import {useAuth} from '../../Provider/authProvider';
import {USER_SIGNIN_REQUEST,USER_SIGNIN_FAIL, USER_SIGNIN_SUCCESS} from '../../Provider/constants/Constant';
import * as yup from 'yup';
import {Formik} from 'formik';
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai';


function SignIn(props) {
  const {state,dispatch} = useAuth();
  const {error,isLoading} = state;
  const [info,setInfo] = useState('');
  const [visible,setVisible] = useState(false);

  const handleSubmit = async (values) =>{  
      const {email,password} = values;
      dispatch({
        type:USER_SIGNIN_REQUEST
      })
    try{
        const {data:{data}} = await API.post('/login',{email,password});
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

  // make schema validation
  const schema = yup.object({
    email: yup.string().required().email('Email is invalid format'),
    password: yup.string().required().min(8,'The password must be a minimum of 8 characters in length'),
  });



  if(info){
    setTimeout( () =>{
      setInfo('')
    },3500)
 }


  useEffect(() => {
  if(error){
      setInfo(error);
      dispatch({
        type:USER_SIGNIN_FAIL,
        payload:null
      })
  }
  
  },[error])


   
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
                <Formik
                  validationSchema={schema}
                  onSubmit={ values => handleSubmit(values)}
                  initialValues={{
                    email:'',
                    password:'',
                  }}
                 >
                  {({handleSubmit,handleChange,handleBlur,values,touched,errors}) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                        {info && <div className="flash_info">{info}</div> } 
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="email" 
                            placeholder="Email" 
                            name="email" 
                            autoComplete="true"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.email && !errors.email}
                            isInvalid={!!errors.email}/>
                            <p className="text-danger"> {errors.email}</p>
                        </Form.Group>

                        <Form.Group>
                            <InputGroup>
                            <Form.Control type={visible ? 'text' : 'password'} 
                            placeholder="Password" 
                            autoComplete="true"
                            name="password" 
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.password && !errors.password}
                            isInvalid={!!errors.password}/>
                            <InputGroup.Append>
                              <InputGroup.Text id="password" style={{cursor:'pointer'}} onClick={ () => setVisible(!visible)}>
                                {visible ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
                              </InputGroup.Text>
                            </InputGroup.Append>
                            </InputGroup>
                            <p className="text-danger"> {errors.password}</p>
                        </Form.Group>
                        <Form.Group>
                            <button type="submit" className="btn btn-danger outline-0 w-100">    
                            {isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/>: 'Sign In' }</button>
                        </Form.Group>
                      
                        <Form.Group>
                            <div className='exclamation-text'>
                                Dont't have an account ? 
                                <button onClick={props.openSignInModal}>Click Here</button>    
                            </div>
                        </Form.Group>
                      </Form>
                    )}
                    </Formik>
                </div>
              </Modal.Body>
            </div>
        </Modal>
        </div>
      </>
    );
}
    
export default SignIn;