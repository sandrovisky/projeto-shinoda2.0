import axios from 'axios'

const api = axios.create({
    //http://localhost:3333
    //https://api-shinoda.herokuapp.com
    baseURL: "http://localhost:3333"
});

export default api

