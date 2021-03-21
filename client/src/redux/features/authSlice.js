import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

export const {setAuth} = authSlice.actions;

// Thunks
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//     setTimeout(() => {
//          dispatch(incrementByAmount(amount));
//     }, 1000);
// };

// @SELECTORS
export const selectIsAuth = (state) => state.auth.isAuth;

export default authSlice.reducer;
