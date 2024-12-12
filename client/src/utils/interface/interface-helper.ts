// interface fro the useFieldRenderers function

import React from "react";
import { Control, UseFormRegister } from "react-hook-form";

interface ValueInterface {
  label?: string | number | undefined;
  options?: OptionInterface[];
}
interface OptionInterface {
  label?: string | number | undefined;
  value?: string | number | undefined;
}

interface FieldRendererInterface {
  index: number;
  value?: any | string | number | undefined;
  label: string;
  isOpen?: boolean;
  playIcon?: string;
  showField?: number;
  handlePlay?: (label: string, name: string | undefined) => void;
  videoFieldClass?: string;
  project: any;
  name?: string;
  options?: OptionInterface[];
  control: Control<any>;
  register: UseFormRegister<any>;
  usersList?: any[];
  showSelected?: string;
  selectedOption?: ValueInterface[];
}

interface UseFieldRenderersInterface {
  styles: { [key: string]: string };
  clearable?: boolean;
}

interface FieldRenderers {
  video: (props: FieldRendererInterface) => React.ReactNode;
  text: (props: FieldRendererInterface) => React.ReactNode;
  number: (props: FieldRendererInterface) => React.ReactNode;
  image: (props: FieldRendererInterface) => React.ReactNode;
  audio: (props: FieldRendererInterface) => React.ReactNode;
  user: (props: FieldRendererInterface) => React.ReactNode;
}
// field renderer ends here

interface CallWithTimeoutParams {
  fn: (params: object | any) => Promise<{ response?: unknown } | string[] | object | any>;
  params?: object;
  timeout?: number;
  interval?: number;
}

// interface for s3 Transload Complete Check
interface s3TransloaditCompletionCheckInterface {
  data?: {
    results?: {
      [key: string]: Array<{ ssl_url?: string }>;
    };
  };
}
// vimeo Transload  interface
interface VimeoTransloaditUploadMapInterface {
  data?: {
    results?: {
      [key: string]: Array<{ ssl_url?: string; meta?: { duration?: number } }>;
    };
  };
}

interface VideoInfo {
  id: string | undefined;
  duration?: number;
  name?: string;
}

// interface fro s3Transload  Upload
interface S3TransloaditUploadMapResultInterface {
  name: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
  duration: number;
  s3Key?: string;
  thumbnailUrl?: string;
  thumbnailS3Key?: string;
}

interface S3TransloaditFiledInterface {
  ssl_url?: string | undefined;
  type?: string | undefined;
  original_id?: string | undefined;
  ext?: string | undefined;
  size?: number | undefined;
  meta?: { duration?: number | undefined };
  data?: any[] | undefined;
  completed?: boolean | undefined;
  abort?: boolean | undefined;
  response?: any[] | undefined;
}

interface S3TransloadFieldInterface {
  prefix?: string;
}

// interface role Hierarchy
interface RoleHierarchyInterface {
  superadmin: number;
  backend: number;
  "executive-producer": number;
  producer: number;
  // crew: number;
  [key: string]: number;
}

export {
  VideoInfo,
  FieldRenderers,
  UseFieldRenderersInterface,
  FieldRendererInterface,
  CallWithTimeoutParams,
  RoleHierarchyInterface,
  S3TransloadFieldInterface,
  S3TransloaditFiledInterface,
  VimeoTransloaditUploadMapInterface,
  S3TransloaditUploadMapResultInterface,
  s3TransloaditCompletionCheckInterface,
};
