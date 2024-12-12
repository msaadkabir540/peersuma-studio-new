import { UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface EditShortLinkModalInterface {
  isSubmitting: boolean;
  shortLinkText: string;
  editShortLink: boolean;
  handleClose: () => void;
  register: UseFormRegister<FormSchemaInterface | any>;
  setValue: UseFormSetValue<FormSchemaInterface | any>;
  handleSubmit: UseFormHandleSubmit<FormSchemaInterface | any>;
  handleShotLink: ({ shotLink }: { shotLink: string }) => void;
}

interface FormSchemaInterface {
  shortLink: string;
}

export { EditShortLinkModalInterface, FormSchemaInterface };
