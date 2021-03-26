import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';

const initialState = {
  allStations: [],
  currentStation: {},
  loading: false,
};

export const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations: (state, action) => {
      state.allStations = action.payload;
    },
    setStationsUnit: (state, action) => {
      state.allStations = state.allStations.map((s) => {
        if (s.ID_Station === action.payload.id) {
          return {
            ...s,
            units: [...action.payload.units],
          };
        } else return {...s};
      });
    },
    setCurrentStation: (state, action) => {
      return {
        ...state,
        currentStation: {
          ...state.allStations.filter(
            (s) => s.ID_Station === action.payload
          )[0],
        },
      };
    },
    setStationFullUnits: (state, action) => {
      return {
        ...state,
        currentStation: {...state.currentStation, fullUnits: action.payload},
      };
    },

    setCurrentStationOptimal: (state, action) => {
      return {
        ...state,
        currentStation: {
          ...state.currentStation,
          optimal: [...state.currentStation.optimal, action.payload],
        },
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const {
  setStations,
  setStationsUnit,
  setCurrentStation,
  setStationFullUnits,
  setCurrentStationOptimal,
  setLoading,
} = stationsSlice.actions;

//@Thunks
export const getStations = (string) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const data = await stationsAPI.getAllStations(string);
  await dispatch(setStations(data));
  const state = getState();
  state.stations.allStations.map(async (s) => {
    let unitData = await stationsAPI.getStationsUnit(s.ID_Station);
    dispatch(setStationsUnit({id: s.ID_Station, units: unitData}));
  });
  dispatch(setLoading(false));
};

export const setCurrentStationThunk = (id) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  await dispatch(setCurrentStation(id));
  let data = await stationsAPI.getStationFullUnits(id);
  await dispatch(setStationFullUnits(data));
  const state = getState();
  state.stations.currentStation.fullUnits.map(async (u) => {
    let optimal = await stationsAPI.getStationOptimal(u.ID_Measured_Unit);
    console.log(optimal);
    await dispatch(setCurrentStationOptimal(optimal));
  });
  dispatch(setLoading(false));
};

// @SELECTORS
export const selectAllStations = (state) => state.stations.allStations;
export const selectLoading = (state) => state.stations.loading;

export default stationsSlice.reducer;
