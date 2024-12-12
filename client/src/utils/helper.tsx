import heic2any from "heic2any";
import axios from "@/utils/axios";
import { useEffect } from "react";

import { handleDownload } from "@/api-services/utils";
import {
  VideoInfo,
  RoleHierarchyInterface,
  S3TransloaditFiledInterface,
  VimeoTransloaditUploadMapInterface,
  s3TransloaditCompletionCheckInterface,
} from "./interface/interface-helper";

import createNotification from "@/common/create-notification";

export const apiRequest = async ({
  type,
  path,
  body,
  params,
  config,
  formData,
  setLoading,
}: any) => {
  setLoading && setLoading(true);
  try {
    const res = await (axios as any)[type](
      path,
      formData
        ? body
        : {
            ...(body && body),
            ...(["get", "delete"]?.includes(type) && params && { params }),
          },
      { ...config, ...(["post", "put"].includes(type) && params && { params }) },
    );
    setLoading && setLoading(false);
    return res;
  } catch (err) {
    setLoading && setLoading(false);
    console.error(err as Error);
    return err;
  }
};

export const useOutsideClickHook: (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => void = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

export const callWithTimeout = ({
  fn,
  params = {},
  timeout = 15 * 60 * 1000,
  interval = 5 * 1000,
}: {
  fn: (params: object | any) => Promise<{ response?: unknown } | string[] | object | any>;
  params?: object;
  timeout?: number;
  interval?: number;
}) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const result = await fn({ ...params });
        if (result?.abort) {
          clearInterval(intervalId);
          createNotification("error", result?.response);
          reject(new Error(result?.response));
        }
        if (result?.completed) {
          clearInterval(intervalId);
          resolve(result);
        }
      } catch (error) {
        console.error("Error calling function:", error);
        clearInterval(intervalId);
        reject(error);
      }
    }, interval);

    setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error("Function call timed out."));
    }, timeout);
  });
};

export const convertFileSize: (bytes: number) => void = (bytes) => {
  const units = ["bytes", "KB", "MB", "GB", "TB"];

  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return bytes.toFixed(2) + " " + units[i];
};

export const convertTime: (decimalTime: number) => string = (decimalTime) => {
  const totalSeconds = Math.floor(decimalTime);
  const milliseconds = Math.round((decimalTime - totalSeconds) * 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours ? `${hours} ${hours > 1 ? "hrs " : "hr "}` : ""}${
    minutes ? `${minutes} ${minutes > 1 ? "mins " : "min "}` : ""
  }${seconds || milliseconds ? `${seconds + milliseconds / 1000} sec` : ""}`;
};

export const convertTimeToSeconds: (time: string) => number | undefined = (time) => {
  if (time === undefined || 0) {
    return 0;
  } else {
    // split the time string into hours, minutes, seconds, and milliseconds
    const parts = time.split(":");
    // convert hours to seconds
    let seconds = +parts[0] * 60 * 60;
    // convert minutes to seconds
    seconds += +parts[1] * 60;
    // add the seconds
    seconds += +parts[2];
    // add the milliseconds
    seconds += +parts[3] / 1000;
    return seconds;
  }
};

//done
export const clearTextSelection = (): void => {
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection && selection.empty) {
      // Chrome
      selection.empty();
    } else if (selection && selection.removeAllRanges) {
      // Firefox
      selection.removeAllRanges();
    }
  } else if ((document as any).selection) {
    // IE
    const selection = (document as any).selection;
    if (selection.empty) {
      selection.empty();
    }
  }
};

// done

export const s3TransloaditCompletionCheck = (res: s3TransloaditCompletionCheckInterface) => {
  const results = Object.keys(res?.data?.results as any);
  return (
    results
      ?.map(
        (x) =>
          (res?.data?.results?.[x] || [])?.length > 0 &&
          res?.data?.results?.[x]?.filter((x) => x?.ssl_url?.indexOf("peersuma") === -1)?.length ===
            0,
      )
      .filter((x) => x === false).length === 0
  );
};

export const vimeoTransloaditUploadMap: (
  resp: VimeoTransloaditUploadMapInterface,
) => VideoInfo[] = (resp) => {
  return (
    resp?.data?.results?.[":original"]?.map((file) => ({
      id: file?.ssl_url?.split("/").pop(),
      duration: file?.meta?.duration,
    })) || []
  );
};

// export const s3TransloaditUploadMap = (resp: any, fields: any) => {
//   console.log({ resp });

//   const files =
//     resp?.data?.results?.["convert_to_mp4"] ||
//     resp?.data?.results?.["convert_heic_to_jpg"] ||
//     resp?.data?.results?.[":original"];

//   if (!files) return [];

//   return files.map((file: S3TransloaditFiledInterface) => {
//     const urlName = file?.ssl_url?.split(fields?.prefix)[1];

//     const thumbnailUrl =
//       file?.type === "video"
//         ? resp?.data?.results?.["thumbnail"]?.find(
//             ({ original_id }: { original_id: string }) => original_id === file?.original_id,
//           )?.ssl_url
//         : "";

//     const thumbnailUrlName = thumbnailUrl ? thumbnailUrl?.split(fields?.prefix)[1] : "";

//     return {
//       name: urlName || "",
//       url: file?.ssl_url || "",
//       fileType: getFileType(file?.ext as string, file?.type as string),
//       fileSize: file?.size || 0,
//       duration: file?.meta?.duration || 0,
//       s3Key: (fields?.prefix && fields?.prefix?.slice(1) + urlName) || "",
//       ...(file?.type === "video" && {
//         thumbnailUrl: thumbnailUrl || "",
//         thumbnailS3Key: fields?.prefix?.slice(1) + thumbnailUrlName || "",
//       }),
//     };
//   });
// };

export const s3TransloaditUploadMap = (resp: any, fields: any) => {
  const files: any[] = [];

  const allFiles = [...(resp?.data?.results?.[":original"] || [])];
  allFiles.forEach((file: any) => {
    if (file.ext === "mov") {
      const data = resp?.data?.results?.["convert_to_mp4"]?.find(
        (data: any) => data.original_id === file?.original_id,
      );
      files.push(data);
    } else {
      files.push(file);
    }
  });

  if (!files.length) return [];

  return files.map((file: S3TransloaditFiledInterface) => {
    const urlName = file?.ssl_url?.split(fields?.prefix)[1];

    const thumbnailUrl =
      file?.type === "video"
        ? resp?.data?.results?.["thumbnail"]?.find(
            ({ original_id }: { original_id: string }) => original_id === file?.original_id,
          )?.ssl_url
        : "";

    const thumbnailUrlName = thumbnailUrl ? thumbnailUrl?.split(fields?.prefix)[1] : "";

    return {
      name: urlName || "",
      url: file?.ssl_url || "",
      fileType: getFileType(file?.ext as string, file?.type as string),
      fileSize: file?.size || 0,
      duration: file?.meta?.duration || 0,
      s3Key: (fields?.prefix && fields?.prefix?.slice(1) + urlName) || "",
      ...(file?.type === "video" && {
        thumbnailUrl: thumbnailUrl || "",
        thumbnailS3Key: fields?.prefix?.slice(1) + thumbnailUrlName || "",
      }),
    };
  });
};

const fontExtensions = ["ttf", "otf", "woff", "woff2", "eot"];
const audioExtensions = ["m4a"];
// done
const getFileType: (extension: string, type: string) => string = (extension, type) =>
  (fontExtensions.includes(extension)
    ? "font"
    : audioExtensions.includes(extension)
      ? "audio"
      : type) || "";

// done
export const roleOptions = [
  // { value: "superadmin", label: "Superadmin" },
  // { value: "backend", label: "Backend" },
  { value: "executive-producer", label: "Executive Producer" },
  { value: "producer", label: "Producer" },
  // { value: "crew", label: "Crew" },
];

export const getSameAndSubOrdinateRoles: (
  currentUserRole: string,
) => { value: string; label: string }[] = (currentUserRole) => {
  const roleHierarchy: RoleHierarchyInterface = {
    superadmin: 0,
    backend: 1,
    "executive-producer": 2,
    producer: 3,
    // crew: 4,
  };
  return roleOptions.filter((role) => roleHierarchy[currentUserRole] <= roleHierarchy[role.value]);
};

export const convertHeicToJpeg = async ({ file }: { file: any }) => {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8, // Set the desired quality here
    });
    const convertedFile = new File([convertedBlob as Blob], file.name.replace(/\.heic$/, ".jpeg"), {
      type: "image/jpeg",
    });
    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    return null;
  }
};
export const handleDownloadMedia = async ({
  url,
  name,
  s3Key,
}: {
  s3Key: string;
  url: string;
  name: string;
}) => {
  if (!url) {
    console.error("No URL provided");
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const fileName = name;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (error) {
    try {
      await handleDownload({ name: name, finalFileName: name, s3Key: s3Key });
    } catch (error) {
      console.error("Download failed:", error);
    }
    console.error("Download failed:", error);
  }
};
