import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "@/pages/home";
import Users from "@/pages/users";
import Themes from "@/pages/themes";
import Clients from "@/pages/clients";
import Album from "@/pages/album/main";
import Projects from "@/pages/projects";
import Embed from "@/pages/library/embed";
import Templates from "@/pages/templates";
import WidgetsPage from "@/pages/widgets";
import Library from "@/pages/library/main";
import Inventory from "@/pages/Inventory";
import Categories from "@/pages/categories";
import Player from "@/pages/library/Player";
import CreateUser from "@/pages/users/create";
import Showcase from "@/pages/library/showcase";
import Login from "@/pages/account/login/login";
import MediaLibrary from "@/pages/media-library";
import CreateClient from "@/pages/clients/create";
import AddEditThemes from "@/pages/create-themes";
import AlbumMedia from "@/pages/album/main/album";
import CreateProject from "@/pages/create-project";
import Authentication from "@/pages/authentication";
import CreateTemplate from "@/pages/create-template";
import LoginEmail from "@/pages/account/login-email";
import AlbumLink from "@/pages/album/main/album-link";
import UpdateWidget from "@/pages/widgets/edit-widget";
import CreateWidget from "@/pages/widgets/create-widget";
import AddEditInventories from "@/pages/create-inventory";
import ResetPassword from "@/pages/account/reset-password";
import ForgotPassword from "@/pages/account/forget-password";
import CreateAlbum from "@/pages/album/main/create-update-album";
import CreateUpdateLibrary from "@/pages/library/create-update-library";
import CreateUpdateMediaLibrary from "@/pages/create-update-media-library";

import { isAuthenticated } from "../utils/auth";
import { ContextAPI } from "../context/create-project";

interface PrivateRouteInterface {
  element: React.FC<any>;
  // any props that come into the component
}

// Function to check if the token has expired
const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true; // Token not present, consider it expired
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
  const currentTime = Date.now();
  return currentTime > expirationTime;
};

const PrivateRoute = ({ element: Component }: PrivateRouteInterface) => {
  // Check if the user is authenticated
  // we can enhance it later on where needed
  const authenticated = isAuthenticated();

  // Check if the token has expired
  const tokenExpired = isTokenExpired();

  // Render the protected route only if the user is authenticated and token not expired
  return authenticated && !tokenExpired ? <Component /> : <Navigate to="/sign-in" />;
};

const Routing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hostname.includes("peersuma.new")) {
      navigate("/create-project");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={Projects} />} />
      <Route path="/home" element={<PrivateRoute element={Home} />} />
      <Route path="/categories" element={<PrivateRoute element={Categories} />} />
      {/* <Route path="/widgets" element={<PrivateRoute element={WidgetsPage} />} /> */}
      {/* <Route path="/widget/create" element={<PrivateRoute element={CreateWidget} />} /> */}
      {/* <Route path="/widget/:_id" element={<PrivateRoute element={UpdateWidget} />} /> */}
      <Route path="/media-library" element={<PrivateRoute element={MediaLibrary} />} />
      {/* <Route path="/album" element={<PrivateRoute element={Album} />} />
      <Route path="/albums/:id/" element={<PrivateRoute element={AlbumMedia} />} />
      <Route path="/create-album" element={<PrivateRoute element={CreateAlbum} />} /> */}
      {/* <Route path="/library" element={<PrivateRoute element={Library} />} /> */}
      {/* <Route path="/create-library" element={<PrivateRoute element={CreateUpdateLibrary} />} /> */}
      <Route
        path="/create-update-media-library/:id"
        element={<PrivateRoute element={CreateUpdateMediaLibrary} />}
      />
      <Route
        path="/create-update-media-library"
        element={<PrivateRoute element={CreateUpdateMediaLibrary} />}
      />
      <Route path="/library/:id" element={<PrivateRoute element={CreateUpdateLibrary} />} />
      <Route path="/create-project" element={<PrivateRoute element={CreateProject} />} />
      <Route
        path="/project/:id"
        element={
          <ContextAPI>
            <PrivateRoute element={CreateProject} />
          </ContextAPI>
        }
      />
      <Route path="/templates" element={<PrivateRoute element={Templates} />} />
      <Route path="/create-template" element={<PrivateRoute element={CreateTemplate} />} />
      <Route path="/template/:id" element={<PrivateRoute element={CreateTemplate} />} />
      <Route path="/clients" element={<PrivateRoute element={Clients} />} />
      <Route path="/create-client" element={<PrivateRoute element={CreateClient} />} />
      <Route path="/clients/:id" element={<PrivateRoute element={CreateClient} />} />
      <Route path="/users" element={<PrivateRoute element={Users} />} />
      <Route path="/users/:id" element={<PrivateRoute element={CreateUser} />} />
      <Route path="/create-user" element={<PrivateRoute element={CreateUser} />} />
      <Route path="/themes" element={<PrivateRoute element={Themes} />} />
      <Route path="/inventory" element={<PrivateRoute element={Inventory} />} />
      <Route path="/create-themes" element={<PrivateRoute element={AddEditThemes} />} />
      <Route path="/create-inventory" element={<PrivateRoute element={AddEditInventories} />} />
      <Route path="/inventory/:id" element={<PrivateRoute element={AddEditInventories} />} />
      <Route path="/themes/:id" element={<PrivateRoute element={AddEditThemes} />} />
      {/*  not private route */}
      <Route path="/play" element={<Player />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/embed/:id" element={<Embed />} />
      <Route path="/sign-email" element={<LoginEmail />} />
      <Route path="/showcase/:id" element={<Showcase />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/album-media-upload/:id" element={<AlbumLink />} />
      <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default Routing;
