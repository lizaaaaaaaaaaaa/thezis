import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/router";
import { DataProvider } from "./context/DataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <RouterProvider router={routes} />
  </DataProvider>
);
