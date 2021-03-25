import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';

const initialState = {
  allStations: [],
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
  },
});

export const {setStations, setStationsUnit} = stationsSlice.actions;

//@Thunks
export const getStations = (string) => async (dispatch, getState) => {
  const data = await stationsAPI.getAllStations(string);
  await dispatch(setStations(data));
  const state = getState();
  state.stations.allStations.map(async (s) => {
    let unitData = await stationsAPI.getStationsUnit(s.ID_Station);
    dispatch(setStationsUnit({id: s.ID_Station, units: unitData}));
  });
};

// @SELECTORS
export const selectAllStations = (state) => state.stations.allStations;

export default stationsSlice.reducer;
