import axios from 'axios'

const api = axios.create({
    //http://localhost:3333
    //https://api-shinoda.herokuapp.com
    baseURL: "https://api-shinoda.herokuapp.com"
});

export default api

