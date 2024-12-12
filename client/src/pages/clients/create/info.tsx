import Input from "@/components/input";
import SelectBox from "@/components/multi-select-box";

import { usaStateName } from "./states";

import { InfoInterface } from "../clients-interface";

import styles from "./index.module.scss";

const Info: React.FC<InfoInterface> = ({ register, errors, control }) => {
  return (
    <>
      <div className={styles.activeTab} style={{ marginBottom: "15px" }}>
        <div className={styles.infoText}>
          <Input
            name="name"
            required={true}
            register={register}
            label="School Name"
            placeholder="Enter school name"
            errorMessage={errors?.name?.message}
          />
          <Input
            name="website"
            label="Website"
            register={register}
            placeholder="Enter website url"
          />
          {/* <Input
            name="vimeoFolderName"
            label="Vimeo Folder Name"
            register={register}
            placeholder="Enter Vimeo Folder Name"
            errorMessage={errors?.vimeoFolderName?.message}
          /> */}
          <Input
            name="district"
            label="District"
            register={register}
            placeholder="Enter district"
          />
          <div className={styles.field}>
            <SelectBox
              showSelected
              label={"Select state"}
              name="state"
              isClearable
              control={control}
              placeholder={"Select state"}
              options={usaStateName || []}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Info;
