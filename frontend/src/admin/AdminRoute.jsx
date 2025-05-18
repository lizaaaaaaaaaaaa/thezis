import React from "react";
import NoAccess from "./noAccess/NoAccess";

const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isAdmin = userData?.accessType === "admin";

  if (!isAdmin) {
    return <NoAccess />;
  }

  return children;
};

export default AdminRoute;
