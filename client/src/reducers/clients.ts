import { ClientInterface } from "@/interface/client-interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  status: false,
  selectedClient: localStorage.getItem("selectedClient") || null,
  currentClient: null,
};

const slice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setAllClientsInStore: (state, action) => {
      state.status = true;
      state.clients = action.payload.clients;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload.client as never);
    },
    updateClientInStore(state, action) {
      const index = state.clients.findIndex(
        (client: ClientInterface) => client.id === action.payload.id,
      );

      state.clients.splice(index, 1, { ...action.payload.data } as never);
    },
    selectedClientOptions: (state, action) => {
      state.status = false;
      state.currentClient = action.payload;
      state.selectedClient = action.payload;
      localStorage.setItem(
        "selectedClient",
        action.payload?.[0]?._id ? action.payload?.[0]?._id : action.payload,
      );
    },
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
  },
});

export const {
  addClient,
  setCurrentClient,
  updateClientInStore,
  setAllClientsInStore,
  selectedClientOptions,
} = slice.actions;

export default slice.reducer;
