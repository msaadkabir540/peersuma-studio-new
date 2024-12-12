import { TableColumns, TableColumnRenderProps } from "@/components/table/table-interface";
import { RowsInterface } from "@/interface/tables-interface";

import _ from "lodash";
import moment from "moment/moment";

import video from "@/assets/videoLogo.png";

import style from "./templates.module.scss";

const Columns: TableColumns[] = [
  {
    key: "templateVideoThumbnailUrl",
    title: "",
    render: ({ row }: TableColumnRenderProps) => {
      const rows = row as RowsInterface;
      return (
        <div className={style.thumbnailContainer}>
          <div className={style.iconDiv}>
            {(row as RowsInterface)?.templateVideoThumbnailUrl ? (
              <img
                height={50}
                src={rows?.templateVideoThumbnailUrl}
                alt="templateVideoThumbnailUrl"
              />
            ) : (
              <img height={50} src={video} alt="video" />
            )}
          </div>
          <div className={style.thumbnailZoom}>
            {rows?.templateVideoUrl ? (
              <div style={{ marginTop: "30px" }}>
                {rows?.templateVideoUrl && (
                  <video
                    src={rows?.templateVideoUrl}
                    controls
                    height={200}
                    width={400}
                    muted={true}
                  />
                )}
              </div>
            ) : (
              <div>
                <img src={video} alt="video" />
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "templateName",
    title: "Template Name",
    sortKey: "templateName",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "description",
    title: "Description",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "updatedAt",
    title: "Updated at",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD");
    },
  },
  {
    key: "mediaFilesCount",
    title: "Media Files",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
