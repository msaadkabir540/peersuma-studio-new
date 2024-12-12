interface ProjectFieldSchema {
  projectName: string | undefined;
  yourName: string | undefined;
  clientId: string;
}
interface projectDataInterface {
  yourName?: string | undefined;
  projectName?: string | undefined;
}
interface CreateUpdateProjectInterface {
  open: boolean;
  data?: projectDataInterface;
  handleModalClose: () => void;
  handleUpdateProjectData?: (argu: any) => void;
  handleIncrementUpdatePage?: () => void;
}

export { ProjectFieldSchema, CreateUpdateProjectInterface, projectDataInterface };
