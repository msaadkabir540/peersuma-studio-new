import { memo } from "react";

import { FileFieldsinterface, MediaType } from "../../media-list-interface";

const List = ({
  fileFields,
  media,
  clickOnFieldFields,
}: {
  fileFields?: FileFieldsinterface[];
  media: MediaType;
  clickOnFieldFields: ((e: any, name: string, label: string, media: MediaType) => void) | undefined;
}) => {
  return (
    <ul>
      {fileFields?.map(({ label, name }: FileFieldsinterface, index: number) => {
        return (
          <li
            aria-hidden="true"
            key={index}
            title={label}
            onClick={(e) => {
              clickOnFieldFields && clickOnFieldFields(e, name, label, media);
            }}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
};

export default memo(List);
