import React,{useEffect,useContext,useState} from 'react';
import {Modal,Form} from 'react-bootstrap';
import {CgAttachment} from 'react-icons/cg';
import {BiBookAdd} from 'react-icons/bi';
import {LIST_CATEGORY_REQUEST,LIST_CATEGORY_SUCCESS,LIST_CATEGORY_FAIL,ADD_PRODUCT_REQUEST,ADD_PRODUCT_SUCCESS,ADD_PRODUCT_FAIL} from './Provider/constants/Constant';
import {useAuth} from './Provider/authProvider';
import {ProductContext} from './Provider/productProvider';
import Fileuploader from './FileUploadScreen';
import {API} from '../http';
import path from 'path';
import { Formik} from "formik";
import * as Yup from "yup";


export default function AddLiteratureScreen(props) {
    const {state:authData} = useAuth();
    const {userInfo} = authData;
    const [show,setShow] = useState(false);
    const [showMessage,setShowMessage] = useState(false);
    const [categoryId,setCategoryId] = useState(1);
    const [state,dispatch] = useContext(ProductContext);
    const {isLoading,error,listCategory,newBook}  = state;
    const [cover,setCover] = useState('');
    const [file,setFile] = useState('');
    const [status,setStatus] = useState('');


    const openModal = () => setShow(true);
    
    const closeModal = () =>{
        setShow(false);
        props.history.push('/profile')
    }

    // submit    
    const handleSubmit = async (values) =>{
    const {title,author,publication,pages,ISBN,description} = values;
            // add new data 
            const BookData = {
                title:title,
                author:author,
                publication:parseInt(publication),
                category:{
                    id:categoryId
                },
                pages:parseInt(pages),
                ISBN:parseInt(ISBN),
                cover:cover,
                attachment:file,
                status:status,
                description:description
            }
        console.log('isi values',BookData)
            dispatch({
                type:ADD_PRODUCT_REQUEST
            })
        try{    
        const {data:{message}} = await API.post('/literature',BookData,{
            headers:{
                Authorization:`${userInfo.token}`
            }
        })
            dispatch({
                type:ADD_PRODUCT_SUCCESS,
                payload:message
            })
        }catch(err){
            dispatch({
                type:ADD_PRODUCT_FAIL,
                payload:err.response.data.message
            })
        }
        
       if(userInfo.isAdmin){
           props.history.push('/profile')
       }else{
            setShowMessage(true);
       }
    }


    // get urls
    const getUrls = (url) =>{
        const ext = path.extname(url).toLowerCase();
        console.log('isi url',url)
        if(ext === '.png' || ext === '.jpg' || ext === '.jpeg'){
            setCover(url);
        }else if(ext === '.pdf'){
            setFile(url);
        }    
    }

    console.log('isi cover',cover+'file : '+file)
   
  

    useEffect(() => {
        const getListCategory= async () =>{
                dispatch({
                    type:LIST_CATEGORY_REQUEST
                })
            try{
                const {data:{data}} = await API.get(`/category`,{
                    headers:{
                        Authorization:`${userInfo.token}`
                    }
                })
      
                dispatch({
                    type:LIST_CATEGORY_SUCCESS,
                    payload:data
                })
            }catch(error){
                dispatch({
                    type:LIST_CATEGORY_FAIL,
                    payload:error
                })
            }
        }
       getListCategory();


       if(userInfo){
            if (userInfo.isAdmin){
                setStatus('approved')
            }else{
                setStatus('waiting to be verificated')
            }           
       }
     
    },[])

    // validation schema
    const schema =  Yup.object().shape({
        title: Yup.string()
            .min(3, "Mininum 3 characters")
            .required("Required!"),
        author: Yup.string()
            .min(3, "Mininum 3 characters")
            .required("Required!"),
        publication:Yup.number()
            .required("Required!"),
        pages:
            Yup.number()
            .required("Required!"),
        ISBN:Yup.number()
            .min(11,"Mininum 11 characters")
            .required("Required!"),
        description:Yup.string()
            .min(3, "Mininum 3 characters")
            .required("Required!")
        })

   
    return (
        <div className="container">
            <div className='add-book__page text-white'>
                <h1>Add Literature</h1>
                <Formik
                  validationSchema={schema}
                  onSubmit={values => handleSubmit(values)}
                  initialValues={{
                    title: "",
                    author: "",
                    publication: "",
                    pages:"",
                    ISBN:"",
                    category:{
                        id:categoryId
                    },
                    cover:cover ? cover : null,
                    attachment:file ? file : null,
                    status:status ? status : null,
                    description:""
                  }}
                 >
                 {({handleSubmit,handleChange,handleBlur,values,touched,errors}) => (
                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group>
                        <Form.Control type="text" 
                                name="title"  
                                value={values.title}
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                isValid={touched.title && !errors.title}
                                isInvalid={!!errors.title} 
                                placeholder="Title"/>
                              <p className="text-danger"> {errors.title}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" 
                               name="author"  
                               value={values.author}
                               onChange={handleChange} 
                               onBlur={handleBlur}
                               isValid={touched.author && !errors.author}
                               isInvalid={!!errors.author} 
                               placeholder="Author"/>
                              <p className="text-danger"> {errors.title}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" 
                               name="publication"    
                               value={values.publication}
                               onChange={handleChange} 
                               onBlur={handleBlur}
                               isValid={touched.publication && !errors.publication}
                               isInvalid={!!errors.publication} 
                               placeholder="Publication Date" />
                               <p className="text-danger"> {errors.publication}</p>
                    </Form.Group>
                    <Form.Group>
                        <select className="w-100  p-2 select-category"  onChange={ (e) => setCategoryId(e.target.value)}>
                            <option value='choose'>Choose a literature category</option>
                            {!error && listCategory ? listCategory.map( category => 
                                <option value={category.id} key={category.id} >{category.name}</option>
                            ) : null}
                        </select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" 
                                name="pages"  
                                value={values.pages}
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                isValid={touched.pages && !errors.pages}
                                isInvalid={!!errors.pages}
                                placeholder="Pages"/>
                                <p className="text-danger"> {errors.pages}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" 
                               name="ISBN"   
                               value={values.ISBN}
                               onChange={handleChange} 
                               onBlur={handleBlur}
                               isValid={touched.ISBN && !errors.ISBN}
                               isInvalid={!!errors.ISBN}
                               placeholder="ISBN"/>
                               <p className="text-danger"> {errors.ISBN}</p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="textarea" 
                                rows={4}                    placeholder='Description' 
                                name='description' 
                                value={values.description}
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                isValid={touched.description && !errors.description}
                                isInvalid={!!errors.description}
                                placeholder="description"/>
                                <p className="text-danger"> {errors.description}</p>
                    </Form.Group>
                    <Form.Group>
                        <button type="button" className="upload-btn" onClick={openModal}>
                        <span> Attach Literature File</span><CgAttachment/>      
                        </button>
                        <Fileuploader isAddLiterature={true} types={['.png','.jpg','.jpeg','.pdf']} show={show} closeModal={() => setShow(false)} getUrls = {getUrls}/>
                    </Form.Group>
                <div className="add-book__page-btn">
                    <button className='add-book-btn' type="submit" disabled={file =='' || cover ==''} >
                        <span>Add Literature</span><BiBookAdd/>
                    </button>
                    <Message show={showMessage} hide = {closeModal} />
                </div>
                </Form>
                )}
                </Formik>
            </div>
        </div>
    )
}

function Message(props){
    return(
    <Modal show={props.show} onHide={props.hide} centered size="lg">
        <div className="message_box">
            <Modal.Body>
                <div className="text-center">
                    Thank you for adding your own literature to our website
                </div>
                <div className="text-center">
                     please wait 1 x 24 hours to verify whether this book is your writing
                </div>
            </Modal.Body>   
        </div>
    </Modal>     
    )
}