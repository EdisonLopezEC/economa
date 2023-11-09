import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../App";

const ProtectedRoute = ({ canActivate, redirectPath = "/" }) => {
  if (!canActivate) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
