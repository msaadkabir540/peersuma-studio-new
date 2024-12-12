import { useMemo } from "react";

import Input from "@/components/input";
import SelectBox from "@/components/multi-select-box";

import { getSameAndSubOrdinateRoles } from "@/utils/helper";

import { InfoInterface } from "./interface";

import styles from "./index.module.scss";

const Info: React.FC<InfoInterface> = ({ register, control, errors, isEditInfo, watch }) => {
  const currentUserRole = localStorage.getItem("user-role") || "";

  const roles = useMemo(() => {
    return getSameAndSubOrdinateRoles(currentUserRole);
  }, [currentUserRole]);

  return (
    <div className={styles.activeTab} style={{ marginBottom: "15px" }}>
      <div className={styles.infoText}>
        <div className={styles.double}>
          <Input
            label={"Full Name"}
            name="fullName"
            register={register}
            className={styles.inputClass}
            placeholder="Enter Full Name"
            errorMessage={errors?.fullName?.message ? "Name is required" : ""}
          />
          <Input
            label={"User Name"}
            name="username"
            register={register}
            required={true}
            className={styles.inputClass}
            placeholder="Enter Full Name"
            errorMessage={errors?.username?.message ? "User Name is required" : ""}
          />
        </div>
        <div className={styles.double}>
          <Input
            name="email"
            label="Email"
            type={"email"}
            required={true}
            register={register}
            className={styles.inputClass}
            placeholder="Enter email Address"
            errorMessage={errors?.email?.message ? "Email is required" : ""}
          />
          <Input
            type={"text"}
            register={register}
            name="contactNumber"
            label="Contact Number"
            className={styles.inputClass}
            placeholder="Enter contact number"
            errorMessage={errors?.contactNumber?.message}
          />
        </div>
        {isEditInfo && (
          <>
            <div className={styles.double}>
              <Input
                required={true}
                name="password"
                label="Password"
                type={"password"}
                register={register}
                placeholder="Enter Password"
                className={styles.inputClass}
                errorMessage={errors?.password?.message}
              />
              <Input
                required={true}
                type={"password"}
                register={register}
                name="confirmPassword"
                label="Confirm Password"
                className={styles.inputClass}
                placeholder="Enter Confirm Password"
                errorMessage={errors?.confirmPassword?.message}
              />
            </div>
          </>
        )}
        {watch("roles") !== "superadmin" && (
          <div className={styles.selectClass}>
            <label htmlFor={"Role"}>Role</label>
            <SelectBox
              name="roles"
              required={true}
              options={roles}
              control={control}
              label="Select Role"
              showSelected
              placeholder="Select Role"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
