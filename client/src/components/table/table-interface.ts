import { UserTableRows, WidgetTableRows, RowsInterface } from "@/interface/tables-interface";
import { FileType } from "@/pages/media-library/media-library-interface";

interface TableColumnRenderProps {
  value: string | number | boolean | string[] | FileType[];
  index: number;
  row: RowsInterface;
  editing: any;
}

interface TableColumns {
  key: keyof RowsInterface;
  title: string;
  sortKey?: string;
  render?: (
    value: TableColumnRenderProps,
  ) => string | number | boolean | JSX.Element | JSX.Element[];
}

interface TableInterface {
  rows: Array<RowsInterface>;
  columns: Array<TableColumns>;
  editing?: any;
  actions: (actionValues: { row: RowsInterface; index: number }) => JSX.Element | JSX.Element[];
  isLoading: boolean;
  sortColumn?: {
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  customTableClass?: string;
  customBodyTableClass?: string;
  handleSort?: (sortingArgs: { sortBy: string; sortOrder: "asc" | "desc" }) => void | undefined;
  handleRowClick?: (row: RowsInterface) => void;
  rowStyles?: (row: RowsInterface) => React.CSSProperties;
}

export { UserTableRows, TableColumns, TableInterface, TableColumnRenderProps, WidgetTableRows };
