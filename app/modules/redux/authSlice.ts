import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, userRepository } from '..';
import { RootState } from '..';
import { doc } from 'firebase/firestore';

interface AuthState {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggingIn: false,
  isLoggedIn: false,
  user: null,
  error: null,
}

export const loginUser = createAsyncThunk('auth/login', async (user: any) => {
  const userDoc = await userRepository.getUserDoc(user);
  return userDoc;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoggingIn = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    updateSubscription: (state, action: PayloadAction<boolean>) => {
       if(state.user){
        state.user.isSubscribed = action.payload;
       }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    });
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, updateSubscription } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectUserName = (state: RootState) => state.auth.user?.displayName;
export const selectUserEmail = (state: RootState) => state.auth.user?.email;
export const selectUserUid = (state: RootState) => state.auth.user?.uid;
export const selectSubscription = (state: RootState) => state.auth.user?.isSubscribed;


export default authSlice.reducer;
