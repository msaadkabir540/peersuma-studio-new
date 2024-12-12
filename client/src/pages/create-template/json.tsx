import { JsonEditor as Editor } from "jsoneditor-react";

import { JsonInterface } from "./template-interface";

import Button from "@/components/button";

import styles from "./index.module.scss";

const Json: React.FC<JsonInterface> = ({ id, watch, isCreateLoading, placeholder, setValue }) => {
  return (
    <div className={styles.activeTab}>
      <div className={styles.updateBtnDiv}>
        <label htmlFor="ssJson">SS.json</label>
        <Button
          title={id ? "Update" : "Create"}
          type="submit"
          form={"templateForm"}
          className={styles.createButton}
          loaderClass={styles.loaderClass}
          disabled={!watch("templateName")}
          isLoading={isCreateLoading}
        />
      </div>
      <div className={styles.editor}>
        <Editor
          tag="div"
          value={placeholder}
          onChange={(e: string) => {
            setValue("ssJson", e);
          }}
          mode={"code"}
        />
      </div>
    </div>
  );
};

export default Json;
