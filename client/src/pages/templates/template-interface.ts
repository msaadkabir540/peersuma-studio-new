// interface for the all Templates
import { WedgetRowInterface } from "@/interface/tables-interface";

interface SortColumnInterface {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface ColumnTemplateInterface {
  key: keyof WedgetRowInterface | string;
  title: string;
  sortKey?: string;
  render?: (props: {
    row?: Record<string, any>;
    value?: string | number | boolean | string[] | undefined;
  }) => string | number | boolean | JSX.Element | JSX.Element[] | React.ReactNode;
}

interface TemplatesInterface {
  params: SortColumnInterface;
}
export { TemplatesInterface, SortColumnInterface, ColumnTemplateInterface };
