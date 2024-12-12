import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Info from "./info";
import Button from "@/components/button";
import Loading from "@/components/loading";
import createNotification from "@/common/create-notification";

import { getAllClients } from "@/api-services/clients";
import { createUser, getUserById, updateUser } from "@/api-services/users";
import { setAllClientsInStore, addUserInStore, updateUserInStore } from "@/reducers/index";

import { CreateUserFormSchemaInterface } from "./interface";
import { ClientInterface } from "@/interface/client-interface";

import styles from "./index.module.scss";

const CreateUser = () => {
  const {
    watch,
    reset,
    control,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormSchemaInterface>({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      confirmPassword: "",
      roles: "",
    },
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { clients, selectedClient } = useSelector((state: any) => state.clients);
  // loggedInUser
  const { loggedInUser } = useSelector((state: any) => state.users);

  const active = 0;
  const [loader, setLoader] = useState<boolean>(false);
  const [isEditInfo, setIsEditInfo] = useState<boolean>(false);

  const handleGetAllClients = useCallback(async () => {
    try {
      const res = await getAllClients({ params: { sortBy: "", sortOrder: "" } });
      if (res.status === 200)
        dispatch(setAllClientsInStore({ clients: res?.data?.allClients as ClientInterface }));
    } catch (err) {
      console.error({ msg: err });
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (clients.length === 0 && token) handleGetAllClients();
  }, [clients.length, handleGetAllClients]);

  const onSubmit = async (data: CreateUserFormSchemaInterface) => {
    const contactNumber = data?.contactNumber?.replace(/[^0-9]/g, "").slice(-10);
    if (contactNumber && contactNumber?.length < 10) {
      setError("contactNumber", {
        type: "manual",
        message: "Contact number should be 10 digits.",
      });
    } else {
      const { contactNumber, fullName, ...rest } = data;
      const newData = {
        ...rest,
        ...(!id &&
          !["superadmin", "backend"]?.includes(data.roles) && {
            clientId: selectedClient,
          }),
        role: data.roles,
        roles: [data.roles],
        clientId: selectedClient,
        createdByUser: loggedInUser?._id,
        selectedClientId: selectedClient,
        email: data?.email?.toLocaleLowerCase(),
        ...(contactNumber &&
          contactNumber !== "" && {
            contactNumber: contactNumber?.replace(/[^0-9]/g, "").slice(-10),
          }),
        ...(data?.fullName &&
          data?.fullName !== "" && {
            fullName: data?.fullName,
          }),
      };
      const res = id
        ? await updateUser({ id, data: newData })
        : await createUser({ data: newData });

      if (res.status === 200) {
        navigate(`/users`);
        active === 0 && setIsEditInfo(false);
        createNotification("success", res?.data?.msg || "Successfully user saved!");
      } else createNotification("error", res?.data?.msg || "Failed to save.", 5000);
    }
  };

  const getUser = async (id: string) => {
    setLoader(true);
    const res = await getUserById({ userId: id });

    const data = res?.data;
    const role = res?.data?.clientId?.find((client: any) => {
      return client.clientId?._id === selectedClient;
    });

    if (res.status === 200)
      reset({
        email: data?.email || "",
        username: data?.username || "",
        roles: role?.role || "",
        fullName: data?.fullName || "",
        contactNumber: data?.contactNumber || "",
      });

    setLoader(false);
  };

  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  useEffect(() => {
    location?.pathname === "/create-user" && setIsEditInfo(true);
  }, [location?.pathname]);

  return (
    <>
      {loader ? (
        <Loading pageLoader={true} diffHeight={1} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.header}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="button"
                title="< Back to List"
                handleClick={() => {
                  navigate("/users");
                }}
              />
              <h2>{id ? "Update" : "Create"} User</h2>
            </div>
          </div>
          {id && (
            <div className={styles.infoText}>
              <span>User: {watch("username")}</span>
            </div>
          )}
          <div className={styles.topButtonDiv}>
            <>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className={styles.createButton}
                loaderClass={styles.loaderClass}
                title={id ? "Update" : "Create"}
              />
            </>
          </div>
          <Info
            watch={watch}
            errors={errors}
            control={control}
            register={register}
            isEditInfo={isEditInfo}
          />
        </form>
      )}
    </>
  );
};

export default memo(CreateUser);
