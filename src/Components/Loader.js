import React from 'react';
import {Spinner} from 'react-bootstrap';

const Loader = () => {
    return (
        <div className='d-flex justify-content-center pt-5 loader'>
             <Spinner animation='border' variant='success'/>
        </div>
    )
}

export default Loader
