import { memo, ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";

import style from "./container.module.scss";

interface ContainerInterface {
  children: ReactNode | JSX.Element;
  className?: string;
}
const Container: React.FC<ContainerInterface> = ({ children, className }) => {
  const { pathname } = useLocation();

  const isAllow = useMemo(() => {
    return pathNameArray?.some((path) => pathname === path || pathname?.includes(path));
  }, [pathname]);

  return (
    <div className={`${style.container} ${className} ${isAllow ? style.containerNone : ""}  `}>
      {children}
    </div>
  );
};

export default memo(Container);

const pathNameArray = [
  "/play",
  "/embed",
  "/sign-in",
  "/project",
  "/sign-email",
  "/forgot-password",
  "/password-reset",
];
