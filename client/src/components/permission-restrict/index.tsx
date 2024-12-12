import { memo } from "react";
import { useSelector } from "react-redux";

import { PermissionRestrictInterface } from "./permission-interface";
import { LogginInterface } from "@/interface/user-selector-interface";

import accesses from "@/constants/accesses";

const PermissionRestrict: React.FC<PermissionRestrictInterface> = ({ checkAccesses, children }) => {
  const { loggedInUser } = useSelector((state: LogginInterface) => state?.users);
  // get all unique accesses of current user
  const currentUserAccesses = [
    ...new Set(loggedInUser?.roles?.map((role) => accesses[role])?.flat()),
  ];

  // check if any user access matches current access
  const haveAccess = checkAccesses?.some(
    (accessLevel) => currentUserAccesses?.includes(accessLevel as never),
  );

  return haveAccess ? <>{children}</> : <></>;
};

export default memo(PermissionRestrict);
