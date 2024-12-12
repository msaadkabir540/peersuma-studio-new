export const isAuthenticated: () => boolean = () => {
  if (localStorage.getItem("token")) {
    return true;
  }
  return false;
};
