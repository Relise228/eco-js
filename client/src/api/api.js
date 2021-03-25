import axios from 'axios';
import {loginUser} from '../redux/features/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Content-type': 'application/json',
    'x-auth-token': sessionStorage.getItem('token'),
  },
});

export const userAPI = {
  login: (login, password) =>
    instance
      .post('api/auth', {login: login, password: password})
      .then((response) => response.data),
};

export const stationsAPI = {
  getAllStations: (string) =>
    instance.get(`api/station/${string}`).then((response) => response.data),
  getStationsUnit: (id) =>
    instance
      .post('api/station/units/', {ID_Station: id})
      .then((response) => response.data),
};
