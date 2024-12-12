import { SSJsonObjectInterface } from "./json-interface";

interface TemplatesStylesInterface {
  name: string;
  description: string;
  styles_py: string;
  _id: string;
}
interface TemplatesResponseInterface {
  // UIpy: string;
  // createdAt: string;
  // description: string;
  // mediaFiles: string;
  // mediaFilesCount: number;
  // ssJson: string | SSJsonObjectInterface;
  // templateName: string;
  // templateStyles: string;
  // updatedAt: string;
  // _id: string;
  _id: string;
  templateName: string;
  description: string;
  templateStyles: Array<TemplatesStylesInterface>;
  mediaFiles: any;
  createdAt: string;
  updatedAt: string;
  UIpy: string;
  ssJson: string;
  templateVideoS3Key: string;
  templateVideoThumbnailS3Key: string;
  templateVideoThumbnailUrl: string;
  templateVideoUrl: string;
  fields: string;
  uuid?: string;
}
interface TemplatesInterface {
  id: string;
  templateName: string;
  description: string;
  templateStyles: any[];
  mediaFiles: any[];
  createdAt?: string;
  updatedAt?: string;
  UIpy?: string;
  ssJson: string;
  templateVideoUrl?: string;
  templateVideoS3Key?: string;
  templateVideoThumbnailUrl?: string;
  templateVideoThumbnailS3Key?: string;
}

interface TemplateParamsInterface {
  prefix?: string;
  selectBox?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

interface GetAllTemplatesInterface {
  params: TemplateParamsInterface;
  setTemplates?: (argu: []) => void;
}

// interface for the template by id

interface GetTemplateByIdInterface {
  templateId?: string;
}

// interface for the template field Response

interface TemplateResponseFieldsInterface {
  type: string;
  label: string;
  options: any[];
}

// interface for the create template

interface CreateTemlateRequestInterface {
  data: {
    templateName: string;
    description: string;
  };
}

interface CreateTemplateResponseInterface {
  msg: string;
  newTemplate: TemplatesInterface;
}

// interface for the Update template by id

interface UpdateTemplateRequestInterface {
  id: string;
  data: TemplatesInterface;
}

export {
  TemplatesInterface,
  TemplateParamsInterface,
  GetTemplateByIdInterface,
  GetAllTemplatesInterface,
  TemplatesResponseInterface,
  CreateTemlateRequestInterface,
  UpdateTemplateRequestInterface,
  CreateTemplateResponseInterface,
  TemplateResponseFieldsInterface,
};
