import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import Dashboard from "./app";

import { store } from "./store";

import "./index.scss";

import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ToastContainer />
    <Dashboard />
  </Provider>,
);
