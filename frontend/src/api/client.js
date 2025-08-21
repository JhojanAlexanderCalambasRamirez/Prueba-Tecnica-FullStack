import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.response.use(
  (res) => res.data,       
  (err) => Promise.reject(err)
);

export default client;
