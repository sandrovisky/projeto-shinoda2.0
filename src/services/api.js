import axios from 'axios'

const api = axios.create({
    //http://localhost:3333
    //https://api-shinoda.herokuapp.com
    baseURL: "https://api-shinoda.herokuapp.com"
})

api.interceptors.request.use(async config => {
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api

