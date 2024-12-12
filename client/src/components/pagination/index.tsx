import { memo, useMemo } from "react";

// import SelectBox from "@/components/select-box";
import SelectBox from "@/components/multi-select-box";

import left from "@/assets/double-arrow-left.svg";
import right from "@/assets/double-arrow-right.svg";
import leftArrow from "@/assets/single-arrow-left.svg";
import rightArrow from "@/assets/single-arrow-right.svg";

import styles from "./pagination.module.scss";
import { PaginationInterface } from "./pagination-interface";
import { selectOptions } from "./helper";

const Pagination: React.FC<PaginationInterface> = ({
  page = 1,
  pageSize = 30,
  totalCount,
  setValue,
  control,
  perPageText,
}) => {
  const isArrows = useMemo(() => {
    return Math.min(page * pageSize !== 10000 ? page * pageSize : page * totalCount, totalCount);
  }, [page, pageSize, totalCount]);

  return (
    <div className={styles.position}>
      <div className={styles.pagination}>
        <div className={styles.leftFlex}>
          <p style={{ marginLeft: "0px", marginRight: "10px" }}>View</p>
          <div style={{ maxWidth: "100px" }}>
            <SelectBox badge name="pageSize" options={selectOptions} control={control} />
          </div>
          <p>{perPageText ? perPageText : "user per page"}</p>
        </div>
        <div className={styles.rightFlex}>
          <p className={styles.p}>
            {` Showing ${(page - 1) * pageSize === 0 ? 1 : (page - 1) * pageSize} to ${Math.min(
              page * pageSize !== 10000 ? page * pageSize : page * totalCount,
              totalCount,
            )} of ${totalCount}`}{" "}
          </p>
          {/* TODO:saprate setValue logic to functions */}
          <img src={left} alt="left" onClick={() => setValue("page", 1)} />
          <img
            src={leftArrow}
            alt="leftArrow"
            onClick={() => setValue("page", page === 1 ? 1 : page - 1)}
          />
          {page > 1 && (
            <span onClick={() => setValue("page", page - 1)} style={{ cursor: "pointer" }}>
              {page - 1 === 1 ? "1" : page - 1}{" "}
            </span>
          )}
          <span>
            <b style={{ color: "#000000" }}>{page}</b>
          </span>
          {page < Math.ceil(totalCount / pageSize) && (
            <>
              <span>
                <b onClick={() => setValue("page", page + 1)}>{page + 1 > 5 ? "..." : page + 1}</b>
              </span>
              {page + 2 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={() => setValue("page", page + 2)}>
                    {page + 2 > 5 ? "..." : page + 2}
                  </b>
                </span>
              )}
              {page + 3 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={() => setValue("page", page + 3)}>
                    {page + 3 > 5 ? "..." : page + 3}
                  </b>
                </span>
              )}
              {page + 4 <= Math.ceil(totalCount / pageSize) && (
                <span>
                  <b onClick={() => setValue("page", page + 4)}>
                    {page + 4 > 5 ? "..." : page + 4}
                  </b>
                </span>
              )}
            </>
          )}

          {isArrows < totalCount ? (
            <>
              <img
                src={rightArrow}
                alt="rightArrow"
                onClick={() =>
                  setValue(
                    "page",
                    page === Math.ceil(totalCount / pageSize)
                      ? Math.ceil(totalCount / pageSize)
                      : page + 1,
                  )
                }
              />
              <img
                src={right}
                alt="right"
                onClick={() => setValue("page", Math.ceil(totalCount / pageSize))}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(Pagination);
