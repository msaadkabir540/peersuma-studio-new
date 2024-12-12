import { useLocation } from "react-router-dom";
import { useEffect, useState, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dropdown from "react-dropdown";
import PermissionRestrict from "../permission-restrict";

import { selectedClientOptions } from "@/reducers/index";

import { ClientsStateInterface } from "@/interface/user-selector-interface";

import styles from "./index.module.scss";
// NavDropDown
const NavDropDown = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { clients, selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const [currentOption, setCurrentOptions] = useState<string>("");

  const options =
    clients.length > 0 &&
    clients?.map((instance) => ({
      value: instance._id,
      label: instance.name,
    }));

  const handleOnChange = async (e: any) => {
    setCurrentOptions(e.value);
    dispatch(selectedClientOptions(e.value));
  };

  const disabled = useMemo(() => {
    return !["/clients", "/users", "/widgets", "/album", "/library", "/"]?.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    selectedClient && !currentOption && setCurrentOptions(selectedClient);
    clients?.length && !selectedClient && dispatch(selectedClientOptions(clients?.[0]?._id));
  }, [selectedClient, clients]);

  return (
    <div>
      <PermissionRestrict checkAccesses={["change_client"]}>
        <Dropdown
          options={options || []}
          disabled={disabled}
          onChange={handleOnChange}
          value={currentOption}
          placeholder="Select Client"
          controlClassName={styles.rdControlCover}
        />
      </PermissionRestrict>
    </div>
  );
};

export default memo(NavDropDown);
