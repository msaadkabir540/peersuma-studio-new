import React, { useContext } from "react";

import Loading from "@/components/loading";
import RenameFinalFile from "./components/rename-final-video";
import MediaPlayerContainer from "./components/media-player-container";
import SelectedTemplateModal from "./components/selected-template-modal";

import { CreateProjectContext } from "../../context/create-project";

import styles from "./index.module.scss";
import { ContextValueObjectInterface } from "@/context/create-project/context-interface";

const CreateProject: React.FC = () => {
  const { loading, showSelectTemplate } = useContext<ContextValueObjectInterface>(
    CreateProjectContext as any,
  );

  return (
    <>
      <div className={styles.mainWrapper}>
        {loading?.isLoading ? (
          <Loading pageLoader={true} diffHeight={100} />
        ) : (
          <div>
            {/* media player container box  */}
            <MediaPlayerContainer />
            {/* open modal for rendered  */}
            <RenameFinalFile />
            {/* modal for the add template */}
            <div className={styles.subContainer}>
              {showSelectTemplate && <SelectedTemplateModal />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateProject;
