import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Loading from "@/components/loading";
import { addLoggedInUser } from "@/reducers/users";
import { selectedClientOptions } from "@/reducers/clients";
import createNotification from "@/common/create-notification";

import { isAuthentication } from "@/api-services/users";

import logo from "@/assets/peersuma-logo.png";

import styles from "./index.module.scss";

const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = async ({ accessToken }: { accessToken: string }) => {
    if (accessToken) {
      const res = await isAuthentication({ accessToken });
      if (res.status === 200) {
        dispatch(addLoggedInUser({ loggedInUser: res.data }));
        res?.data?.clientId && dispatch(selectedClientOptions(res?.data?.clientId));
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("user-role", res?.data?.roles[0]);
        res?.data?.roles[0] === "crew" || res?.data?.roles[0] === "producer"
          ? navigate("/album")
          : navigate("/");
      } else {
        createNotification("error", res?.data?.message || "Not Found", 5000);
      }
    } else {
      createNotification("error", "Token not Found", 5000);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);
    const accessToken = urlParams.get("accessToken");

    if (accessToken) {
      isAuth({ accessToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const url = window.location.href;
  const urlObj = new URL(url);
  const key = urlObj.searchParams.get("key");

  return (
    <div className={styles.loading}>
      {key ? (
        <></>
      ) : (
        <>
          <img src={logo} alt="peersuma-logo" width="150px" />
          <span>Peersuma</span>
        </>
      )}
      <Loading loaderClass={styles.loader} />
    </div>
  );
};
export default Authentication;
