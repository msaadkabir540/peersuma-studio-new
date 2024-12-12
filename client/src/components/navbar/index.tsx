import { useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Modal from "../modal";
import Button from "../button";
import NavDropDown from "./nav-drop-down";
import PermissionRestrict from "../permission-restrict";

import { setLogout } from "@/reducers/index";

import { useOutsideClickHook } from "@/utils/helper";

import { ClientsStateInterface, LogginInterface } from "@/interface/user-selector-interface";

import logo from "@/assets/peersuma-logo.png";
import settingsIcon from "@/assets/settings-gear.svg";

import "react-dropdown/style.css";
import styles from "./index.module.scss";
import style from "@/pages/clients/clients.module.scss";

const Navbar = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { loggedInUser } = useSelector((state: LogginInterface) => state.users);
  const { currentClient } = useSelector((state: ClientsStateInterface) => state.clients);

  const [navbar, setNavbar] = useState({ show: "none", action: false });
  const { show, action } = navbar;

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Clear Local Storage
    localStorage.clear();
    setNavbar((prev) => ({ ...prev, action: false }));
    navigate(`/sign-in`);
    dispatch(setLogout());
  };

  useOutsideClickHook(wrapperRef as any, () => {
    setNavbar((prev) => ({ ...prev, show: "none" }));
  });

  return (
    <div className={styles.main} style={{ display: `${showNav(pathname)}` }}>
      <div className={styles.title}>
        <Link to="/home" className={styles.link}>
          <img src={logo} alt="peersuma-logo" />
        </Link>
        {navTabs?.map(({ title, route, match, checkAccesses }, index) => (
          <PermissionRestrict key={index} {...{ checkAccesses }}>
            <Link
              to={route}
              className={
                match.some((x) => pathname.includes(x)) || route === pathname
                  ? styles.active
                  : styles.tab
              }
            >
              {title}
            </Link>
          </PermissionRestrict>
        ))}
      </div>
      <div className={styles.pages}>
        <p className={styles.navText}>{currentClient?.name || ""}</p>
        <PermissionRestrict checkAccesses={["change_client"]}>
          <NavDropDown />
        </PermissionRestrict>
        {open && <div className={styles.backdropDiv} onClick={() => setOpen(false)}></div>}
        <div className={styles.logoutDiv}>
          <svg
            className={styles.logout}
            onClick={() => setOpen(true)}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
          {open && (
            <div className={styles.logoutMenu}>
              <span>User Name: {loggedInUser?.username || loggedInUser?.fullName}</span>
              <span>Role: {loggedInUser?.roles?.[0 as any]}</span>
              <Button
                title={"Logout"}
                handleClick={() => setNavbar((prev) => ({ ...prev, action: true }))}
              />
            </div>
          )}
        </div>
        <PermissionRestrict checkAccesses={["admin", "backend", "producer"]}>
          <div
            ref={wrapperRef}
            className={
              pathname === "/categories" || pathname === "/users" ? styles.settingsActive : ""
            }
            style={{
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => {
              show === "none"
                ? setNavbar((prev) => ({ ...prev, show: "grid" }))
                : setNavbar((prev) => ({ ...prev, show: "none" }));
            }}
          >
            <img
              src={settingsIcon}
              style={{
                height: "20px",
                width: "20px",
              }}
              alt="gear-icon"
            />
            <div className={styles.menu} style={{ display: `${show}` }}>
              <PermissionRestrict checkAccesses={["backend"]}>
                <div className={styles.innerDiv}>
                  <h2>Backend Menu</h2>
                  <Link to="/clients" className={pathname === "/clients" ? styles.active : ""}>
                    Schools
                  </Link>
                  <Link to="/categories">Tags</Link>
                </div>
              </PermissionRestrict>
              <PermissionRestrict checkAccesses={["producer"]}>
                <div className={styles.innerDiv}>
                  <h2>Client Menu</h2>
                  <Link to="/users">Users</Link>
                </div>
              </PermissionRestrict>
            </div>
          </div>
        </PermissionRestrict>
        <Modal
          {...{
            open: action,
            handleClose: () => setNavbar((prev) => ({ ...prev, action: false })),
          }}
          className={style.bodyModal}
          modalWrapper={style.opacityModal}
        >
          <div className={style.deleteModal}>
            <svg
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                height: "50px",
                width: "50px",
              }}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
            <h2> Logout </h2>

            <p
              style={{
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want to logout?
            </p>
            <div className={style.buttonContainer}>
              <Button
                type="button"
                title={"No"}
                handleClick={() => {
                  setNavbar((prev) => ({ ...prev, action: false }));
                }}
                className={style.cancelBtn}
              />
              <Button
                type="button"
                title={"Yes"}
                className={style.delBtn}
                loaderClass={style.loading}
                isLoading={false}
                handleClick={handleLogout}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default memo(Navbar);

const pagesWithoutNavbar = ["/sign-in", "/sign-email", "/forgot-password", "/authentication"];

const showNav = (pathname: string) =>
  pagesWithoutNavbar.includes(pathname) ||
  /^\/(password-reset|showcase|embed|player|album-media-upload)\//.test(pathname)
    ? "none"
    : "flex";

const navTabs = [
  { title: "Projects", route: "/", match: ["project"], checkAccesses: ["get_all_projects"] },
  {
    title: "Templates",
    route: "/templates",
    match: ["template"],
    checkAccesses: ["get_all_templates"],
  },
  {
    title: "Media Library",
    route: "/media-library",
    match: ["/media-library"],
    checkAccesses: ["get_all_media_library"],
  },
  {
    title: "Themes",
    route: "/themes",
    match: ["/themes"],
    checkAccesses: ["get_all_media_library"],
  },
  {
    title: "Inventory",
    route: "/inventory",
    match: ["/inventory"],
    checkAccesses: ["get_all_projects"],
  },
];
