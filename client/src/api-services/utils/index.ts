import axios from "axios";

import createNotification from "@/common/create-notification";

export const handleDownload = async ({
  s3Key,
  name,
  finalFileName,
}: {
  s3Key?: string;
  name?: string;
  finalFileName?: string;
}) => {
  const response = await axios({
    method: "GET",
    url: `/utils/download`,
    params: { Key: s3Key, fileName: finalFileName || name },
    responseType: "blob",
  });
  const link = document.createElement("a");
  const href = URL.createObjectURL(response.data);
  link.href = href;
  link.download =
    finalFileName || name?.split(`_${new Date().getFullYear()}`)[0] + `.${name?.split(".").pop()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
  if (response.status === 200) {
    createNotification("success", "Ready for Downloading!");
  }
};
