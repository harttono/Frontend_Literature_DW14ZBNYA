import {API}from '../../../http';
import React,{useState,useEffect} from 'react';
import {Modal,Form,Spinner,InputGroup} from 'react-bootstrap';
import {useAuth} from '../../Provider/authProvider';
import {USER_REGISTER_REQUEST,USER_REGISTER_SUCCESS,USER_REGISTER_FAIL} from '../../Provider/constants/Constant';
import * as yup from 'yup';
import {Formik} from 'formik';
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai';

function SignUp(props) {
    const {state,dispatch} = useAuth();
    const [info,setInfo] = useState('');
    const {error,isLoading} = state;
    const [visible,setVisible] = useState(false);

  //validation schema
  const schema = yup.object().shape({
    email:yup.string().required().email('Email is invalid format'),
    password:yup.string().required().min(8,'The password must be a minimum of 8 characters in length'),
    fullname:yup.string().required().min(3,'The fullname must be a minimum of 3 characters in length'),
    gender:yup.string().required(),
    phone:yup.number().min(13).required(),
    address:yup.string().required()
  });
    

  
    const onSaved = async (values) =>{
      dispatch({
        type:USER_REGISTER_REQUEST,
      })
      try{
        const {data:{data}} = await API.post('/register',{...values});
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
              <Formik
                  validationSchema={schema}
                  onSubmit={ values => onSaved(values)}
                  initialValues={{
                    email:'',
                    password:'',
                    fullname:'',
                    gender:'',
                    phone:'',
                    address:''
                  }}
                 >
                  {({handleSubmit,handleChange,handleBlur,values,touched,errors}) => (
                      <Form noValidate onSubmit={handleSubmit}>
                    {info && <div className="flash_info">{info}</div>} 
                    <Form.Group>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
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
                        <Form.Control 
                            type={visible ? 'text' : 'password'} 
                            name="password" 
                            placeholder="Password" 
                            autoComplete="true"  
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                        <Form.Control 
                            type="text" 
                            name="fullname" 
                            placeholder="Fullname" 
                            autoComplete="true"  
                            value={values.fullname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.fullname && !errors.fullname}
                            isInvalid={!!errors.fullname}/>
                            <p className="text-danger"> {errors.fullname}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                          as="select"  
                          name="gender"   
                          value={values.gender} 
                          onChange={handleChange}  
                          onBlur={handleBlur}  >
                          <option disabled value='DEFAULT'>Select your gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Control>
                        <p className="text-danger"> {errors.gender}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                            type="text" 
                            name="phone" 
                            placeholder="Phone" 
                            autoComplete="true"  
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.phone && !errors.phone}
                            isInvalid={!!errors.phone}/>
                            <p className="text-danger">{errors.phone}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="textarea" style={{color:'#ffffff'}}
                            name="address" 
                            rows="2"  
                            placeholder="Address"  
                            autoComplete="true"  
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.address && !errors.address}
                            isInvalid={!!errors.address}/>
                            <p className="text-danger">{errors.address}</p>
                    </Form.Group>
                    <Form.Group>
                        <button type="submit" className='btn-modal-signUp btn btn__primary outline-0 w-100' onClick={ (e) => handleSubmit(e)}>
                        {isLoading ? <Spinner as="span" animation="grow" size="sm" role="status"aria-hidden="true"/>: 'Sign Up' }
                        </button>
                    </Form.Group>
                    <Form.Group>
                        <div className='exclamation-text'>
                            Already have an account ? <button onClick={ props.openSignUpModal}>Click Here</button>   
                        </div>
                    </Form.Group>
                </Form>
                )}
              </Formik>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </>
    );
}
    
export default SignUp;