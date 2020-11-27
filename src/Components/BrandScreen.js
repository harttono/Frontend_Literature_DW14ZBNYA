import { from } from 'form-data';
import React from 'react';
import {Link} from 'react-router-dom';
function BrandScreen() {
    return (
        <Link to="/">
            <div className='brand'>
                <img src='/asset/img/logo.png' />
            </div>
        </Link>
    )
}

export default BrandScreen
