import Input from "@/components/input";
import Button from "@/components/button";
import TextArea from "@/components/textarea";

import { InfoComponentInterface } from "./template-interface";

import styles from "./index.module.scss";

const Info: React.FC<InfoComponentInterface> = ({
  id,
  watch,
  register,
  errors,
  handleModalOpen,
  isEditInfo,
}) => {
  return (
    <div className={styles.activeTab} style={{ marginBottom: "15px" }}>
      {!isEditInfo ? (
        <div className={styles.infoText}>
          <div className={styles.descriptionTemp}>
            <p>{watch("description")}</p>
          </div>
          <div style={{ marginTop: "30px" }}>
            {watch("templateVideoUrl") && (
              <video controls height={400} width={700}>
                <source src={watch("templateVideoUrl")} type="video/mp4" />
                <track kind="captions" src={watch("templateVideoUrl")} />
              </video>
              // <video src={watch("templateVideoUrl")} controls height={400} width={700} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="templateName">Template Name</label>
          <Input
            name="templateName"
            register={register}
            placeholder="Enter Template Name"
            errorMessage={errors?.templateName?.message}
          />
          <label htmlFor="ssJson">Description</label>
          <TextArea
            name="description"
            placeholder={"Enter Description"}
            register={register}
            errorMessage={errors?.description?.message}
          />
          {id && (
            <div className={styles.uploadBtn}>
              <Button title="Upload Template Video" type="button" handleClick={handleModalOpen} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Info;
