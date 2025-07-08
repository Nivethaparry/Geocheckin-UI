import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = 'https://localhost:7252/api/Auth/Login'; 


export const loginUser = createAsyncThunk(
   'auth/loginUser',
    async ({ userName, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await axios.post(backendUrl, { userName, password});
      console.log("API response:",response.data);
     
      return {
     user: {
       id: response.data.id,
       userName: response.data.userName,
       email: response.data.email,
  },
      token: response.data.token,
      rememberMe,
};

      } catch (err) {
     
          return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
    reducers: {
      logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  },
    extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        if(action.payload.token){
        if (action.payload.rememberMe) {
            localStorage.setItem('authToken', action.payload.token);
        } 
        else {
            sessionStorage.setItem('authToken', action.payload.token);
        }
      }})
        .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;