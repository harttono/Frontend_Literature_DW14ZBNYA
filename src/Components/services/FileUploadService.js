import {API} from '../../http';

const upload = (file,onUploadProgress) => {
    let formData = new FormData();

    formData.append('file',file);

    return API.post('/upload',formData,{
        headers:{
            "Content-type":"multipart/form-data"
        },
        onUploadProgress
    })
}

export default{
    upload
}