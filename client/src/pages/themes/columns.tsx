import _ from "lodash";
import moment from "moment/moment";

import { TableColumns, TableColumnRenderProps } from "@/components/table/table-interface";
import { RowsInterface } from "@/interface/tables-interface";

import video from "@/assets/videoLogo.png";

import styles from "./index.module.scss";

const Columns: TableColumns[] = [
  {
    key: "themeVideoThumbnailUrl",
    title: "",
    render: ({ row }: TableColumnRenderProps) => {
      const rows = row as RowsInterface;
      return (
        <div className={styles.thumbnailContainer}>
          <div className={styles.iconDiv}>
            {(row as RowsInterface)?.themeVideoThumbnailUrl ? (
              <img height={50} src={rows?.themeVideoThumbnailUrl} alt="themeVideoThumbnailUrl" />
            ) : (
              <img height={50} src={video} alt="video" />
            )}
          </div>
          <div className={styles.thumbnailZoom}>
            {rows?.themeVideoThumbnailUrl ? (
              <div style={{ marginTop: "30px" }}>
                {rows?.themeVideoThumbnailUrl && (
                  <video
                    src={rows?.themeVideoThumbnailUrl}
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
    key: "themeName",
    title: "Theme Name",
    sortKey: "themeName",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "themesDescription",
    title: "Description",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "updatedAt",
    title: "Updated At",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD");
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
