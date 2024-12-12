"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var home_1 = require("@/pages/home");
var users_1 = require("@/pages/users");
var themes_1 = require("@/pages/themes");
var clients_1 = require("@/pages/clients");
var projects_1 = require("@/pages/projects");
var embed_1 = require("@/pages/library/embed");
var templates_1 = require("@/pages/templates");
var Inventory_1 = require("@/pages/Inventory");
var categories_1 = require("@/pages/categories");
var Player_1 = require("@/pages/library/Player");
var create_1 = require("@/pages/users/create");
var showcase_1 = require("@/pages/library/showcase");
var login_1 = require("@/pages/account/login/login");
var media_library_1 = require("@/pages/media-library");
var create_2 = require("@/pages/clients/create");
var create_themes_1 = require("@/pages/create-themes");
var create_project_1 = require("@/pages/create-project");
var authentication_1 = require("@/pages/authentication");
var create_template_1 = require("@/pages/create-template");
var login_email_1 = require("@/pages/account/login-email");
var album_link_1 = require("@/pages/album/main/album-link");
var create_inventory_1 = require("@/pages/create-inventory");
var reset_password_1 = require("@/pages/account/reset-password");
var forget_password_1 = require("@/pages/account/forget-password");
var create_update_library_1 = require("@/pages/library/create-update-library");
var create_update_media_library_1 = require("@/pages/create-update-media-library");
var auth_1 = require("../utils/auth");
var create_project_2 = require("../context/create-project");
// Function to check if the token has expired
var isTokenExpired = function () {
    var token = localStorage.getItem("token");
    if (!token)
        return true; // Token not present, consider it expired
    var decodedToken = JSON.parse(atob(token.split(".")[1]));
    var expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    var currentTime = Date.now();
    return currentTime > expirationTime;
};
var PrivateRoute = function (_a) {
    var Component = _a.element;
    // Check if the user is authenticated
    // we can enhance it later on where needed
    var authenticated = auth_1.isAuthenticated();
    // Check if the token has expired
    var tokenExpired = isTokenExpired();
    // Render the protected route only if the user is authenticated and token not expired
    return authenticated && !tokenExpired ? React.createElement(Component, null) : React.createElement(react_router_dom_1.Navigate, { to: "/sign-in" });
};
var Routing = function () {
    var navigate = react_router_dom_1.useNavigate();
    react_1.useEffect(function () {
        if (window.location.hostname.includes("peersuma.new")) {
            navigate("/create-project");
        }
    }, [navigate]);
    return (React.createElement(react_router_dom_1.Routes, null,
        React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(PrivateRoute, { element: projects_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/home", element: React.createElement(PrivateRoute, { element: home_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/categories", element: React.createElement(PrivateRoute, { element: categories_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/media-library", element: React.createElement(PrivateRoute, { element: media_library_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-update-media-library/:id", element: React.createElement(PrivateRoute, { element: create_update_media_library_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-update-media-library", element: React.createElement(PrivateRoute, { element: create_update_media_library_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/library/:id", element: React.createElement(PrivateRoute, { element: create_update_library_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-project", element: React.createElement(PrivateRoute, { element: create_project_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/project/:id", element: React.createElement(create_project_2.ContextAPI, null,
                React.createElement(PrivateRoute, { element: create_project_1["default"] })) }),
        React.createElement(react_router_dom_1.Route, { path: "/templates", element: React.createElement(PrivateRoute, { element: templates_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-template", element: React.createElement(PrivateRoute, { element: create_template_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/template/:id", element: React.createElement(PrivateRoute, { element: create_template_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/clients", element: React.createElement(PrivateRoute, { element: clients_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-client", element: React.createElement(PrivateRoute, { element: create_2["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/clients/:id", element: React.createElement(PrivateRoute, { element: create_2["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/users", element: React.createElement(PrivateRoute, { element: users_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/users/:id", element: React.createElement(PrivateRoute, { element: create_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-user", element: React.createElement(PrivateRoute, { element: create_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/themes", element: React.createElement(PrivateRoute, { element: themes_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/inventory", element: React.createElement(PrivateRoute, { element: Inventory_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-themes", element: React.createElement(PrivateRoute, { element: create_themes_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/create-inventory", element: React.createElement(PrivateRoute, { element: create_inventory_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/inventory/:id", element: React.createElement(PrivateRoute, { element: create_inventory_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/themes/:id", element: React.createElement(PrivateRoute, { element: create_themes_1["default"] }) }),
        React.createElement(react_router_dom_1.Route, { path: "/play", element: React.createElement(Player_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/sign-in", element: React.createElement(login_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/embed/:id", element: React.createElement(embed_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/sign-email", element: React.createElement(login_email_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/showcase/:id", element: React.createElement(showcase_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/authentication", element: React.createElement(authentication_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/forgot-password", element: React.createElement(forget_password_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/album-media-upload/:id", element: React.createElement(album_link_1["default"], null) }),
        React.createElement(react_router_dom_1.Route, { path: "/password-reset/:id/:token", element: React.createElement(reset_password_1["default"], null) })));
};
exports["default"] = Routing;
