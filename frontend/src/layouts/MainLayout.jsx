import React from "react";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
    </>
  );
};

export default MainLayout;
