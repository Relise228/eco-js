import {createSlice} from '@reduxjs/toolkit';
import {stationsAPI} from '../../api/api';
import {formatChartObject, parseCommonUnits} from '../../util/util';

const initialState = {
  allStations: [],
  currentStation: {},
  loading: false,
  currentPageIndex: ['1'],
  page: 1,
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
    setCurrentPageIndex: (state, action) => {
      return {
        ...state,
        currentPageIndex: action.payload,
      };
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
    setPage: (state, action) => {
      return {
        ...state,
        page: action.payload,
      };
    },

    setCurrentStationOptimal: (state, action) => {
      const optimal = state.currentStation.optimal
        ? [...state.currentStation.optimal, action.payload]
        : [action.payload];
      return {
        ...state,
        currentStation: {
          ...state.currentStation,
          optimal,
        },
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setMeasurements: (state, action) => {
      return {
        ...state,
        currentStation: {...state.currentStation, measurements: action.payload},
      };
    },
    setMeasurementsFormated: (state, action) => {
      return {
        ...state,
        currentStation: {
          ...state.currentStation,
          measurementsFormated: action.payload,
        },
      };
    },
    setSelectedMeasuredId: (state, action) => {
      return {
        ...state,
        currentStation: {
          ...state.currentStation,
          selectedMeasuredId: action.payload,
        },
      };
    },
    setUnitInfo: (state) => {
      return {
        ...state,
        currentStation: {
          ...state.currentStation,
          selectedUnitInfo: state.currentStation.fullUnits?.filter(
            (u) =>
              u.ID_Measured_Unit === state.currentStation.selectedMeasuredId
          ),

          selectedUnitInfoOptimal: state.currentStation.optimal?.filter(
            (u) =>
              u[0]?.ID_Measured_Unit === state.currentStation.selectedMeasuredId
          ),
        },
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
  setMeasurements,
  setMeasurementsFormated,
  setSelectedMeasuredId,
  setUnitInfo,
  setCurrentPageIndex,
  setPage,
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

export const setCurrentStationThunk =
  (id, DateFrom, DateTo, ID_Measured_Unit) => async (dispatch, getState) => {
    await dispatch(setCurrentStation(id));
    let data = await stationsAPI.getStationFullUnits(id);
    await dispatch(setStationFullUnits(data));
    let state = getState();
    state.stations.currentStation.fullUnits.map(async (u) => {
      let optimal = await stationsAPI.getStationOptimal(u.ID_Measured_Unit);
      await dispatch(setCurrentStationOptimal(optimal));
    });

    let measurements = await stationsAPI.getStationMeasurements(
      DateFrom,
      DateTo,
      state.stations.currentStation.ID_Station,
      state.stations.currentStation.fullUnits[0].ID_Measured_Unit
    );
    await dispatch(setMeasurements(measurements));
    state = getState();
    await dispatch(
      setMeasurementsFormated(
        formatChartObject(state.stations.currentStation.measurements)
      )
    );
    await dispatch(
      setSelectedMeasuredId(
        state.stations.currentStation.fullUnits[0].ID_Measured_Unit
      )
    );
    await dispatch(setUnitInfo());
  };

export const setCurrentStationMeasurements =
  (DateFrom, DateTo, ID_Measured_Unit) => async (dispatch, getState) => {
    let state = getState();
    let measurements = await stationsAPI.getStationMeasurements(
      DateFrom,
      DateTo,
      state.stations.currentStation.ID_Station,
      ID_Measured_Unit
    );
    await dispatch(setMeasurements(measurements));
    state = getState();
    dispatch(
      setMeasurementsFormated(
        formatChartObject(state.stations.currentStation.measurements)
      )
    );

    dispatch(setLoading(false));
  };

export const updateFavorite =
  (ID_Station, isFavorite) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const data = await stationsAPI.updateStatusFavorive(ID_Station, isFavorite);
    dispatch(setLoading(false));
  };

// @SELECTORS
export const selectAllStations = (state) => state.stations.allStations;
export const selectPage = (state) => state.stations.page;
export const selectCurrentPageIndex = (state) =>
  state.stations.currentPageIndex;
export const selectLoading = (state) => state.stations.loading;
export const selectCurrentStation = (state) => state.stations.currentStation;
export const selectSelectedUnitInfo = (state) =>
  state.stations.currentStation.selectedUnitInfo;
export const selectSelectedUnitInfoOptimal = (state) =>
  state.stations.currentStation.selectedUnitInfoOptimal;

export default stationsSlice.reducer;
