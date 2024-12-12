import { configureStore } from "@reduxjs/toolkit";

import { clientReducer, userReducer } from "../reducers";

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    users: userReducer,
  },
});
