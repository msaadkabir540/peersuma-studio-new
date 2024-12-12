import React, { SetStateAction } from "react";
import { Control, UseFormWatch } from "react-hook-form";

import { CreateProjectFormInterface, ProjectInterface } from "../../interface";

interface HeaderButtonComponentInterface {
  handleGenerateSSJson: () => void;
  handleCloseMedia: () => void;
  isSSJsonLoading: boolean | undefined;
  isFinalVideoLoading: boolean | undefined;
  renderVideo: (finalFileName: string) => void;
}

interface headerButtonInterface {
  type: string;
  ssJsonFinalModal?: boolean;
  mergeFileName?: any;
}

interface HeaderButtonComponentContextInterface {
  id: string;
  isLoading: boolean;
  submitDisabled: boolean;
  project: ProjectInterface;
  updateAndSaveEvents: () => void;
  assemblyHandleEvent: () => void;
  draftHandleEvent: () => void;
  templateHandleEvent: () => void;
  stagingHandleEvent: () => void;
  control: Control<CreateProjectFormInterface>;
  watch: UseFormWatch<CreateProjectFormInterface>;
  dispatchProject: React.Dispatch<SetStateAction<headerButtonInterface>>;
}

export { HeaderButtonComponentInterface, HeaderButtonComponentContextInterface };
