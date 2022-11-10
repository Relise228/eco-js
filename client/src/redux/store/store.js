import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import stationsReducer from "../features/stationsSlice"
import compareReducer from "../features/compareSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    stations: stationsReducer,
    compare: compareReducer
  }
})
