import axios from 'axios';
import Cookies from 'js-cookie';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
});

client.interceptors.request.use(function (config) {
  const csrfToken = Cookies.get('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

export default client;