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
  getOneStation: (id) =>
    instance
      .post(`api/station/one/`, {ID_Station: id}, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
        },
      })
      .then((response) => response.data),
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
        'api/measurement/optimalValue',
        {ID_Measured_Unit: idUnit},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  getStationMeasurements: (DateFrom, DateTo, ID_Station, ID_Measured_Unit) =>
    instance
      .post(
        'api/station/measurements',
        {
          DateFrom: DateFrom,
          DateTo: DateTo,
          ID_Station: ID_Station,
          ID_Measured_Unit: ID_Measured_Unit,
        },
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
  updateStatusFavorive: (ID_Station, isFavorite) =>
    instance
      .post(
        'api/station/changeFavorite',
        {ID_Station, isFavorite: `${isFavorite}`},
        {
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
          },
        }
      )
      .then((response) => response.data),
};
