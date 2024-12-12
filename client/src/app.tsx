import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Routing from "@/routes/index";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Container from "@/components/container";

import { getAllClients } from "./api-services/clients";
import createNotification from "./common/create-notification";
import {
  setUsers,
  addLoggedInUser,
  setCurrentClient,
  setAllClientsInStore,
  selectedClientOptions,
} from "./reducers";
import { getAllUsers, getUserById } from "./api-services/users";

import logo from "@/assets/peersuma-logo.png";

import style from "./app.module.scss";

const Dashboard = () => {
  const dispatch = useDispatch();

  // loggedInUser
  const { loggedInUser } = useSelector((state: any) => state.users);
  // clients, selectedClient
  const { clients, selectedClient } = useSelector((state: any) => state.clients);

  const [loading, setLoading] = useState<boolean>(true);

  const handleGetAllClients = async () => {
    try {
      const response = await getAllClients({
        params: { sortOrder: "asc", sortBy: "name" },
      });
      if (response.status === 200) {
        dispatch(setAllClientsInStore({ clients: response?.data?.allClients }));
      } else {
        throw new Error("Failed to fetch clients!");
      }
    } catch (error: any) {
      console.error({ error: error?.message });
    }
  };

  //
  const handleGetAllUsers = async () => {
    try {
      const res: any = await getAllUsers({
        params: {
          clientId: selectedClient,
        },
      });
      if (res.status == 200) {
        dispatch(setUsers(res?.data?.users));
      } else {
        createNotification("error", res?.data?.error || "Failed", 5000);
      }
    } catch (err) {
      console.error("err", err);
    }
  };

  const getUser = async () => {
    const res = await getUserById();
    dispatch(addLoggedInUser({ loggedInUser: res.data }));
    res?.data?.clientId && dispatch(selectedClientOptions(res?.data?.clientId));
    res?.data?.client && dispatch(setCurrentClient(res?.data?.client));
  };

  const url = window.location.href;
  const urlObj = new URL(url);
  const key = urlObj.searchParams.get("key");

  const effect = async () => {
    if (!clients?.length || loggedInUser === null) {
      setLoading(true);
      !clients?.length && (await handleGetAllClients());
      loggedInUser === null && (await getUser());
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.message !== "No token provided!" && localStorage.getItem("token")) effect();
    else setLoading(false);
  }, [loggedInUser]);

  useEffect(() => {
    loggedInUser && selectedClient !== null && handleGetAllUsers();
  }, [selectedClient, loggedInUser]);

  return (
    <>
      {loading ? (
        <div className={style.loading}>
          {key ? (
            <></>
          ) : (
            <>
              <img src={logo} alt="peersuma-logo" width="150px" />
              <span>Peersuma</span>
            </>
          )}
          <Loading loaderClass={style.loader} />
        </div>
      ) : (
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <Container>
              <Routing />
            </Container>
          </BrowserRouter>
        </div>
      )}
    </>
  );
};

export default Dashboard;
