import { createSlice } from "@reduxjs/toolkit";
import { Users } from "../interface";

const initialState: {
  users: Users[];
  status: boolean;
  loggedInUser: any;
  token: string | null;
} = {
  users: [],
  status: false,
  loggedInUser: null,
  token: null,
};

const users = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.status = true;
      state.users = action.payload;
    },
    addUserInStore: (state, action) => {
      state.users.push(action.payload.user);
    },
    updateUserInStore: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      state.users.splice(index, 1, { ...action.payload.user });
    },
    addLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload.loggedInUser;
    },
    setLogout: (state) => {
      state.users = [];
      state.status = false;
      state.loggedInUser = null;
      state.token = null;
    },
  },
});

export const { setUsers, addUserInStore, updateUserInStore, addLoggedInUser, setLogout } =
  users.actions;

export default users.reducer;
