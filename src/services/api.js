import axios from 'axios'

const api = axios.create({
    baseURL: "https://api-shinoda.herokuapp.com"
});

export default api

