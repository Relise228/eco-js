import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';
import {formatChartObject, parseCommonUnits} from '../../util/util';
import {setLoading} from './stationsSlice';

const initialState = {};

export const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    setStationFullUnits: (state, action) => {
      return {
        ...state,
        fullUnits: action.payload,
      };
    },

    setMeasurements: (state, action) => {
      return {
        ...state,
        measurements: action.payload,
      };
    },

    setSelectedMeasuredId: (state, action) => {
      return {
        ...state,
        selectedMeasuredId: action.payload,
      };
    },
  },
});

export const {
  setStationFullUnits,
  setSelectedMeasuredId,
  setMeasurements,
} = compareSlice.actions;

//@Thunks

export const setCompareUnits = (firstId, secondId) => async (
  dispatch,
  getState
) => {
  dispatch(setLoading(true));
  let fullUnitsFirst = await stationsAPI.getStationFullUnits(firstId);
  let fullUnitsSecond = await stationsAPI.getStationFullUnits(secondId);
  const compareUnits = parseCommonUnits(fullUnitsFirst, fullUnitsSecond);
  const selected = compareUnits[0] ? compareUnits[0] : false;
  dispatch(
    setStationFullUnits({
      first: fullUnitsFirst,
      second: fullUnitsSecond,
      compareUnits: compareUnits,
    })
  );
  selected && dispatch(setSelectedMeasuredId(selected.ID_Measured_Unit));
  dispatch(setLoading(false));
};

export const setStationsMeasurements = (
  DateFrom,
  DateTo,
  ID_Station_First,
  ID_Station_Second,
  firstName,
  secondName
) => async (dispatch, getState) => {
  let state = getState();
  console.log(state);
  let measurements_first = await stationsAPI.getStationMeasurements(
    DateFrom,
    DateTo,
    ID_Station_First,
    state.compare.selectedMeasuredId
  );
  console.log('first >>>>>', measurements_first);
  let measurements_second = await stationsAPI.getStationMeasurements(
    DateFrom,
    DateTo,
    ID_Station_Second,
    state.compare.selectedMeasuredId
  );
  console.log('second >>>>>');

  measurements_first = formatChartObject(measurements_first, firstName);

  measurements_second = formatChartObject(measurements_second, secondName);
  await dispatch(setMeasurements({measurements_first, measurements_second}));
  /// next Create CHART from data in store
  // state = getState();
  // dispatch(
  //   setMeasurementsFormated(
  //     formatChartObject(state.stations.currentStation.measurements)
  //   )
  // );
};

// @SELECTORS

export const selectFullUnits = (state) => state.compare.fullUnits;
export const selectSelectedMeasuredId = (state) =>
  state.compare.selectedMeasuredId;
export const selectMeasurements = (state) => state.compare.measurements;

export default compareSlice.reducer;
