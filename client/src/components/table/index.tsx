import { Fragment, memo } from "react";

import Loading from "@/components/loading";

import sortUp from "@/assets/sortUp.svg";
import sortDown from "@/assets/sortDown.svg";
import sort from "@/assets/sort-svgrepo-com.svg";

import { TableInterface } from "./table-interface";

import style from "./table.module.scss";

const Table: React.FC<TableInterface> = ({
  rows,
  columns,
  editing,
  actions,
  isLoading,
  rowStyles,
  handleSort,
  sortColumn,
  handleRowClick,
  customTableClass,
  customBodyTableClass,
}) => {
  return (
    <>
      {!isLoading ? (
        <>
          <div className={`${style.TBodyCustom} ${customBodyTableClass}`}>
            <table className={`${style.tableClass} ${customTableClass}`}>
              <thead>
                <tr>
                  {columns?.map((column, index) => (
                    <th key={index}>
                      <div
                        className={style.headingStyle}
                        onClick={() =>
                          !sortColumn || column?.sortKey !== sortColumn?.sortBy
                            ? handleSort &&
                              handleSort({ sortBy: column?.sortKey || "", sortOrder: "asc" })
                            : sortColumn.sortOrder === "asc"
                              ? handleSort &&
                                handleSort({ sortBy: column.sortKey, sortOrder: "desc" })
                              : handleSort &&
                                handleSort({ sortBy: column.sortKey, sortOrder: "asc" })
                        }
                      >
                        {column?.title}
                        {column?.sortKey && (
                          <>
                            {!sortColumn || column?.sortKey !== sortColumn?.sortBy ? (
                              <img src={sort} height={24} alt="sort" />
                            ) : sortColumn?.sortOrder === "asc" ? (
                              <img src={sortUp} height={24} alt="sortUp" />
                            ) : (
                              <img src={sortDown} height={24} alt="sortDown" />
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {rows?.length > 0 && (
                <tbody>
                  {rows?.map((row, index) => (
                    <Fragment key={index}>
                      <tr
                        key={row?._id}
                        style={rowStyles ? rowStyles(row) : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick && handleRowClick(row);
                        }}
                      >
                        {columns?.map((column, index) => {
                          if (column.key === "actions") return actions({ row, index });

                          return (
                            <td key={`${index}-${column.key}`}>
                              {column?.render &&
                                column?.render({
                                  row,
                                  index,
                                  value: row?.[column?.key] || "",
                                  editing,
                                })}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          {rows?.length === 0 && (
            <div className={style.flex}>
              <h5 style={{ textAlign: "center", width: "100%" }}>No Data</h5>
            </div>
          )}
        </>
      ) : (
        <Loading pageLoader={true} loaderClass={style.loaderClass} diffHeight={600} />
      )}
    </>
  );
};

export default memo(Table);
