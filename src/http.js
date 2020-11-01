import Axios from 'axios';

export const API  = Axios.create({
  baseURL:"https://literature04.herokuapp.com/api/v1"
})