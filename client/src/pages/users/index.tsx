import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import Switch from "@/components/switch";
import { setUsers } from "@/reducers/index";
import Pagination from "@/components/pagination";
import SelectBox from "@/components/multi-select-box";
import createNotification from "@/common/create-notification";

import {
  getAllUsers,
  changePassword,
  deleteUserById,
  updateUserStatus,
  deletePermanentUserById,
} from "@/api-services/users";

import { getSameAndSubOrdinateRoles } from "@/utils/helper";

import { Columns, TableActions } from "./columns";
import ResetPasswordModal from "./reset-password-modal";
import { ActionInterface, FormSchema } from "./interface";
import { Users as UsersApiInterface } from "@/interface/account-interface";

import delIcon from "@/assets/del-icon.svg";
import crossFat from "@/assets/cross-fat.svg";

import style from "./users.module.scss";

const Users = () => {
  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      page: 1,
      role: "",
      search: "",
      password: "",
      pageSize: 30,
      totalCount: 0,
      mySwitch: true,
      confirmPassword: "",
    },
  });

  const tableForm = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedClient } = useSelector((state: any) => state.clients);
  const { users = [] as UsersApiInterface[], loggedInUser } = useSelector(
    (state: any) => state.users,
  );

  const roleOptions = getSameAndSubOrdinateRoles(loggedInUser?.roles?.[0]);

  const [loader, setLoader] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "",
    sortOrder: "asc",
  });
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [deleteAction, setDeleteAction] = useState<ActionInterface>({
    action: false,
    id: "",
    name: "",
  });

  const [permanentDelete, setPermanentDelete] = useState<ActionInterface>({
    action: false,
    id: "",
    _id: "",
    name: "",
  });
  const [changeAction, setChangeAction] = useState<ActionInterface>({
    action: false,
    id: "",
    name: "",
  });

  const handleGetAllUsers = async () => {
    try {
      setUserLoading(true);
      const res = await getAllUsers({
        params: {
          ...sortColumn,
          page: watch("page"),
          search: watch("search"),
          pageSize: watch("pageSize"),
          role: watch("mySwitch") ? watch("role") : "superadmin",
          ...(["superadmin", "backend"].includes(loggedInUser?.roles?.[0]) && {
            clientId: selectedClient,
          }),
        },
      });
      if (res?.status == 200) {
        dispatch(setUsers(res?.data?.users || []));
        setValue("totalCount", res?.data?.count || 0);
      } else createNotification("error", res?.data?.error || "Failed", 5000);

      setUserLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async ({ id }: { id: string }) => {
    await updateUserStatus(id);
  };

  const handleDelete = async (userId: string) => {
    setIsDeleting(userId);
    const res = await deleteUserById({ userId });
    if (res.status === 200) {
      const newData = (users as UsersApiInterface[]).filter((f) => f._id !== userId);
      dispatch(setUsers(newData));
    } else {
      createNotification("error", res?.data?.error || "Failed", 5000);
    }
    setIsDeleting("");
  };

  const handlePermanentDelete = async (userId: string) => {
    setPermanentDelete((prev) => ({ ...prev, action: false, _id: userId }));
    const res = await deletePermanentUserById({ userId, clientId: selectedClient });
    if (res.status === 200) {
      const newData = (users as UsersApiInterface[]).filter((f) => f._id !== userId);
      dispatch(setUsers(newData));
      createNotification("success", res?.data?.msg || "Successfully deleted", 5000);
    } else {
      createNotification("error", res?.data?.error || "Failed", 5000);
    }
    setPermanentDelete((prev) => ({ ...prev, _id: "" }));
  };

  const onSubmit = async (data: FormSchema) => {
    setLoader(true);
    if (data.password !== data.confirmPassword) {
      createNotification("error", "Passwords do not match", 5000);
    } else {
      const res = await changePassword({ id: changeAction?.id, password: data?.password });
      if (res.status === 200) {
        createNotification("success", "Password changed successfully ");
        setChangeAction({ action: false, id: "", name: "" });
        reset({});
      } else {
        createNotification("error", res?.data?.error || "Failed", 5000);
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    handleGetAllUsers();
  }, [
    sortColumn,
    watch("role"),
    watch("page"),
    watch("search"),
    watch("pageSize"),
    watch("mySwitch"),
  ]);

  const userTableRows = useMemo(() => {
    return users?.map((user: UsersApiInterface) => {
      const role = user?.clientId?.find((client: any) => client.clientId === selectedClient);
      return {
        _id: user?._id,
        id: user?._id,
        fullName: user?.fullName,
        username: user?.username,
        email: user?.email,
        role: role?.role || user?.roles || [],
        status: user?.status,
        updatedAt: user?.updatedAt,
      };
    });
  }, [users]);

  return (
    <div>
      <div className={style.cBtn}>
        <Input
          name="search"
          label="Search"
          register={register}
          iconClass={style.searchIconContainer}
          iconEleClass={style.searchIcon}
          {...{
            ...(watch("search") && {
              icon: crossFat,
              onClick: () => {
                setValue("search", "");
              },
            }),
          }}
        />
        <SelectBox
          badge
          name="role"
          showSelected
          control={control}
          label="Role"
          placeholder={"Select"}
          options={roleOptions || []}
          wrapperClass={style.multiSelect}
          selectBoxClass={style.selectBox}
        />
      </div>
      <div className={style.cBtn}>
        <div className={style.switchUser}>
          <label>{watch("mySwitch") ? "All Users" : "Super Admin"}</label>
          <Switch
            control={control}
            className={style.switchClassChild}
            name={"mySwitch"}
            defaultValue={false}
            silderClass={style.silderClass}
            switchContainer={style.switchContainer}
          />
        </div>
        <Button
          title="Create User"
          handleClick={() => {
            navigate("/create-user");
          }}
        />
      </div>
      <Table
        rows={userTableRows}
        columns={Columns({ control: tableForm?.control, handleStatusChange })}
        sortColumn={sortColumn}
        customBodyTableClass={style.customClassUser}
        handleSort={(sort) => setSortColumn(sort)}
        isLoading={userLoading}
        actions={({ row }) => {
          return (
            <TableActions
              row={row}
              isDeleting={isDeleting}
              setDeleteAction={setDeleteAction}
              setChangeAction={setChangeAction}
              setPermanentDelete={setPermanentDelete}
              permanentDeleteLoading={permanentDelete}
            />
          );
        }}
      />
      <Pagination
        page={watch("page")}
        pageSize={watch("pageSize")}
        totalCount={watch("totalCount")}
        control={control}
        setValue={setValue}
        perPageText="Records per page"
      />
      {/* delete modal */}
      <Modal
        {...{
          open: deleteAction.action,
          handleClose: () => setDeleteAction({ action: false, id: "", name: "" }),
        }}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
      >
        <div className={style.deleteModal}>
          <img src={delIcon} height={50} alt="delIcon" />
          <h2>Temporary Delete User</h2>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            Are you sure want to temporary delete <strong>{deleteAction.name}</strong>?.
          </p>
          <div className={style.buttonContainer}>
            <Button
              type="button"
              title={"Cancel"}
              handleClick={() => {
                setDeleteAction({ action: false, id: "", name: "" });
              }}
              className={style.cancelBtn}
            />
            <Button
              type="button"
              title={"Delete"}
              className={style.delBtn}
              loaderClass={style.loading}
              isLoading={false}
              handleClick={async () => {
                await handleDelete(deleteAction.id);
                setDeleteAction({ action: false, id: "", name: "" });
              }}
            />
          </div>
        </div>
      </Modal>
      {/* permanent delete modal */}
      <Modal
        open={permanentDelete.action}
        handleClose={() => setPermanentDelete({ action: false, id: "", name: "" })}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
      >
        <div className={style.deleteModal}>
          <img src={delIcon} height={50} alt="delIcon" />
          <h2>Permanent Delete User</h2>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            Are you sure want to permanent delete <strong>{permanentDelete?.name}</strong>?.
          </p>
          <div className={style.buttonContainer}>
            <Button
              type="button"
              title={"Cancel"}
              handleClick={() => {
                setPermanentDelete({ action: false, id: "", name: "" });
              }}
              className={style.cancelBtn}
            />
            <Button
              type="button"
              title={"Delete"}
              className={style.delBtn}
              loaderClass={style.loading}
              isLoading={false}
              handleClick={async () => {
                await handlePermanentDelete(permanentDelete.id);
                setPermanentDelete({ action: false, id: "", _id: "", name: "" });
              }}
            />
          </div>
        </div>
      </Modal>
      {/* change action modal */}
      <ResetPasswordModal
        changeAction={changeAction}
        setChangeAction={setChangeAction}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        loader={loader}
        password={watch("password")}
        confirmPassword={watch("confirmPassword")}
      />
    </div>
  );
};

export default Users;
