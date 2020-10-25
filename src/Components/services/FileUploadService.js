import Axios from 'axios';

const upload = (file,onUploadProgress) => {
    let formData = new FormData();

    formData.append('file',file);

    return Axios.post('/api/v1/upload',formData,{
        headers:{
            "Content-type":"multipart/form-data"
        },
        onUploadProgress
    })
}

export default{
    upload
}