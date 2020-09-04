import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.bas.inf.br',
});

export default api;