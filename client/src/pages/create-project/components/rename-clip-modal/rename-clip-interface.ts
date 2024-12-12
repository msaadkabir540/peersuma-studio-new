import { SetStateAction } from "react";

import { stagingFieldsInterface } from "../../interface";
import { RenameClipInterface } from "../staging/staging-interface";

export interface RenameClipModalInterface {
  setRenameVideoClip: React.Dispatch<SetStateAction<RenameClipInterface>>;
  isRenameModal: boolean;
  clipName: string | undefined;
  handleUpdate: ({ text }: { text: string }) => void;

  stagingFields: Array<stagingFieldsInterface>;
}
