import moment from "moment/moment";

import { RowsInterface } from "@/interface/tables-interface";
import { TableColumns, TableColumnRenderProps } from "@/components/table/table-interface";

import video from "@/assets/videoLogo.png";

import styles from "./index.module.scss";

const Columns: TableColumns[] = [
  {
    key: "thumbnailUrl",
    title: "",
    render: ({ row }: TableColumnRenderProps) => {
      const rows = row as RowsInterface;
      return (
        <div className={styles.thumbnailContainer}>
          <div className={styles.iconDiv}>
            {(row as RowsInterface)?.thumbnailUrl || row?.customeThumbnailUrl ? (
              <img
                height={200}
                src={rows?.customeThumbnailUrl ? rows?.customeThumbnailUrl : rows?.thumbnailUrl}
                alt="thumbnailUrl"
              />
            ) : (
              <img height={200} src={video} alt="video" />
            )}
          </div>
          <div className={styles.thumbnailZoom}>
            {rows?.thumbnailUrl ? (
              <div style={{ marginTop: "30px" }}>
                {rows?.thumbnailUrl && (
                  <video src={rows?.url} controls height={200} width={400} muted={true} />
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
    key: "name",
    title: "Name",
    sortKey: "name",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "category",
    title: "Category",
    sortKey: "category",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "level",
    title: "Level",
    sortKey: "level",
    render: ({ value }: TableColumnRenderProps) => {
      const levelName = levelOption.find((data) => {
        return data.value === value;
      });
      return levelName?.label as string;
    },
  },
  {
    key: "updatedAt",
    title: "Updated On",
    sortKey: "updatedAt",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD");
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };

const levelOption = [
  { label: "K-2", value: "K-2" },
  { label: "3-5", value: "3-5" },
  { label: "6-8", value: "6-8" },
  { label: "9-12", value: "9-12" },
  { label: "N/A", value: "N/A" },
];
