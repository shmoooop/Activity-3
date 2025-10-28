import axios from 'axios';

const ApiClient = axios.create({
  baseURL: '/' 
});

export default ApiClient;