import Input from "@/components/input";

import { ExcInfoInterface } from "../clients-interface";

import styles from "./index.module.scss";

const ExecutiveInfo: React.FC<ExcInfoInterface> = ({ register, errors }) => {
  return (
    <>
      <div className={styles.activeTab} style={{ marginBottom: "15px" }}>
        <div className={styles.infoText}>
          <Input
            name="excProdName"
            required={true}
            register={register}
            label="Executive Producer Full Name"
            placeholder="Enter name"
            errorMessage={errors?.excProdName?.message}
          />
          <Input
            name="executiveProducerContact"
            label="Executive Producer Contact Number"
            required={true}
            type={"number"}
            isContactNumber={true}
            register={register}
            placeholder="Enter Contact Number"
            errorMessage={errors?.executiveProducerContact?.message}
          />
          <Input
            required={true}
            type="email"
            name="executiveProducerEmail"
            label="Executive Producer Email"
            register={register}
            placeholder="Enter Email"
            errorMessage={errors?.executiveProducerEmail?.message}
          />
        </div>
      </div>
    </>
  );
};

export default ExecutiveInfo;
