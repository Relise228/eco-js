import axios from 'axios';
import {loginUser} from '../redux/features/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Content-type': 'application/json',
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
    instance
      .get(`api/station/${string}`, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
  getStationsUnit: (id) =>
    instance
      .post(
        'api/station/units/',
        {ID_Station: id},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getStationFullUnits: (id) =>
    instance
      .post(
        'api/station/unitsFull/',
        {ID_Station: id},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getStationOptimal: (idUnit) =>
    instance
      .post(
        'api/measurement/oprimalValue',
        {ID_Measured_Unit: idUnit},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
};
