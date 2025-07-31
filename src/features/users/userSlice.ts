import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Enhanced user type to support different user roles
export type TUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Optional fields for different user types
  doctorID?: number; // For doctors - their doctor profile ID
  patientID?: number; // For patients - their patient profile ID
  adminID?: number; // For admins - their admin profile ID
};

// App user state
export type UserState = {
  token: string | null;
  user: TUser | null;
};

const initialState: UserState = {
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    // Helper action to update user profile info
    updateUserProfile: (state, action: PayloadAction<Partial<TUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, logout, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;