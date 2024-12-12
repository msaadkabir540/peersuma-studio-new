import React, { memo } from "react";

import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import changeIcon from "@/assets/change-password.png";

import { ResetPasswordModalInterface } from "./interface";

import style from "./users.module.scss";

const ResetPasswordModal: React.FC<ResetPasswordModalInterface> = ({
  changeAction,
  setChangeAction,
  handleSubmit,
  onSubmit,
  register,
  errors,
  loader,
  password,
  confirmPassword,
}) => {
  return (
    <Modal
      {...{
        open: changeAction.action,
        handleClose: () => setChangeAction({ action: false, id: "", name: "" }),
      }}
      className={style.bodyModal1}
      modalWrapper={style.opacityModal}
    >
      <div className={style.deleteModal}>
        <img src={changeIcon} height={50} alt="changeIcon" />
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} id="passwordForm">
          <div className={style.activeTab}>
            <div className={style.inputContainer}>
              <Input
                label="New Password"
                name="password"
                type={"password"}
                required={true}
                register={register}
                placeholder="Enter Password"
                errorMessage={errors?.password?.message}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={"password"}
                required={true}
                register={register}
                placeholder="Confirm Password"
                errorMessage={errors?.confirmPassword?.message}
              />
              <div className={style.buttonContainer}>
                <Button
                  type="button"
                  title={"Cancel"}
                  handleClick={() => {
                    setChangeAction({ action: false, id: "", name: "" });
                  }}
                  className={style.cancelBtn}
                />
                <Button
                  type="submit"
                  title={"Save"}
                  isLoading={loader}
                  className={style.delBtn}
                  loaderClass={style.loading}
                  disabled={!password || !confirmPassword}
                  styles={{
                    ...(password && confirmPassword
                      ? ""
                      : { color: "rgba(0, 0, 0, 0.26)", backgroundColor: "rgba(0, 0, 0, 0.12)" }),
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default memo(ResetPasswordModal);
