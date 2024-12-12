import TemplateTab from "./components/template-tab";
import TemplateTabCards from "./components/template-tab-cards";

import { TemplateContainerPropsInterface } from "./interface";

import styles from "./index.module.scss";

const TemplateContainer: React.FC<TemplateContainerPropsInterface> = ({ handleClipClicks }) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div className={styles.subContainers}>
        <TemplateTabCards />
      </div>
      <TemplateTab handleClipClicks={handleClipClicks} />
    </div>
  );
};

export default TemplateContainer;
