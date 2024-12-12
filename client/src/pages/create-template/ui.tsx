import Button from "@/components/button";
import Loading from "@/components/loading";
import TextArea from "@/components/textarea";

import useFieldRenderers from "@/components/project-field-render-hook";

import { UIInterface } from "./template-interface";
import { FieldRenderers } from "@/utils/interface/interface-helper";

import styles from "./index.module.scss";

const UI: React.FC<UIInterface> = ({
  id,
  watch,
  register,
  templateFields,
  isFieldLoading,
  isCreateLoading,
  setTemplateFields,
  hanldeGetTemplateFields,
}) => {
  const fieldRenderers = useFieldRenderers({ styles, clearable: false });

  return (
    <div className={styles.flexDiv}>
      <>
        <div className={styles.activeTab} style={{ marginBottom: "10px", width: "60%" }}>
          <div className={styles.updateBtnDiv}>
            <label htmlFor="UIpy">UI.py</label>
            <Button
              title={id ? "Update" : "Create"}
              type="submit"
              className={styles.createButton}
              loaderClass={styles.loaderClass}
              disabled={!watch("templateName")}
              isLoading={isCreateLoading}
            />
          </div>
          <TextArea rows={23} name="UIpy" register={register} placeholder="Enter UIPY" />
        </div>
        <div
          className={styles.field}
          style={{
            marginBottom: "15px",
            width: "35%",
          }}
        >
          <div className={styles.testFieldBtn}>
            <Button
              type="button"
              title={"Test Fields"}
              disabled={!id || !watch("UIpy")}
              className={styles.createButton}
              loaderClass={styles.loaderClass}
              isLoading={isFieldLoading}
              handleClick={() => hanldeGetTemplateFields(fieldRenderers as FieldRenderers)}
            />
          </div>
          {templateFields?.length > 0 && (
            <>
              <div className={styles.headerDiv}>
                <label>{"Template Fields"}</label>
              </div>
              <div className={styles.form2}>
                {isFieldLoading ? (
                  <div className={styles.templateFieldsLoader}>
                    <Loading />
                  </div>
                ) : (
                  <div>
                    {templateFields?.map(
                      ({ type, render, label, options, fieldLabel, value }, index) => (
                        <div className={styles.field} key={index}>
                          {render({
                            index,
                            label,
                            options,
                            setTemplateFields,
                            value: ["video", "image"].includes(type)
                              ? fieldLabel
                              : type === "number"
                                ? +value
                                : value,
                          })}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default UI;
