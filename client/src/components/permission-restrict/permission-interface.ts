import { ReactNode } from "react";
interface PermissionRestrictInterface {
  checkAccesses: string[];
  children: ReactNode;
}

export { PermissionRestrictInterface };
