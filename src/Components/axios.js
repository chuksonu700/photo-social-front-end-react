import axios from 'axios';

const instance = axios.create({
    baseURL:'https://photo-social-back-end.herokuapp.com/'
})

export default instance;