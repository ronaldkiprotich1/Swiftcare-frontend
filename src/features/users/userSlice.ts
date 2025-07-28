import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  userID: number;
  doctorID?: number | null;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  address: string;
  role: string;
};

export type UserState = {
  token: string | null;
  user: User | null;
};

const initialState: UserState = {
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;