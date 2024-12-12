import moment from "moment";
import React, { useEffect, useState } from "react";
import { NavigateFunction, useLocation, useNavigate, Location } from "react-router-dom";

import Loading from "@/components/loading";
import createNotification from "@/common/create-notification";
import TransloaditUploadModal from "@/components/transloadit-upload-modal";
import { s3TransloaditCompletionCheck, s3TransloaditUploadMap } from "@/utils/helper";
import { getAlbumshotByIdORShotUrl, uploadShotMedia } from "@/api-services/albumshot";

import { AlbumLinkInterface } from "../album-interface";
import { MediaUploadFileType } from "@/pages/media-library/media-library-interface";

import logo from "@/assets/peersuma-logo.png";

import "./index.scss";

const AlbumLink: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);
  const [shot, setShot] = useState<AlbumLinkInterface>({} as AlbumLinkInterface);
  const { album } = shot;

  const pathSegments = location?.pathname?.split("/");
  let shotUrl = pathSegments[pathSegments?.length - 1];

  useEffect(() => {
    if (shotUrl) {
      shotUrl = decodeURI(shotUrl);
      handleGetData();
    }
  }, [shotUrl]);

  const handleGetData = async () => {
    setLoading(true);
    const resp = await getAlbumshotByIdORShotUrl({ shotUrl });
    setLoading(false);
    if (resp?.status === 200) {
      setShot(resp?.data?.data);
    } else {
      createNotification("error", resp?.data?.error ?? "An Error Occurred!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  };

  return (
    <>
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <div className="modalContainer">
          <div className="navbar">
            <img src={logo} alt="peersuma-logo" />
            <div className="details">
              <p>Project: {album?.name || ""}</p>
              <span>({shot?.name})</span>
            </div>
          </div>
          <div className="modalMedia">
            <TransloaditUploadModal
              {...{
                fieldName: true,
                setFieldName: (val) => {},
                allowedFileTypes: null,
                mapUploads: s3TransloaditUploadMap,
                completionCheck: s3TransloaditCompletionCheck,
                fields: {
                  prefix: `/albums/${album?._id}/${shot?._id}/`,
                  timeStamp: moment().format("YYYYMMDD_HHmmss"),
                },
                setUploads: async ({ uploads }) => {
                  setLoading(true);
                  const isUploaded = await uploadShotMedia({
                    id: shot?._id,
                    data: { media: uploads } as MediaUploadFileType,
                  });
                  setLoading(false);
                  if (isUploaded) {
                    createNotification("success", "File(s) uploaded successfully.");
                  }
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumLink;
