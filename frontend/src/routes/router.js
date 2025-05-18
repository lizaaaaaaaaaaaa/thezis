import { createBrowserRouter } from "react-router-dom";
import Ingredients from "./../pages/Ingredients";
import Register from "./../pages/Register";
import Profile from "./../pages/Profile";
import MainLayout from "../layouts/MainLayout";
import ErrorLayout from "../layouts/ErrorLayout";
import Home from "./../pages/Home";
import Products from "./../pages/Products";
import Product from "../pages/Product";
import CompositionDetails from "../pages/CompositionDetails";
import IngredientAdminPage from "../pages/admin/IngridientAdminPage";
import ProductsAdminPage from "./../pages/admin/ProductAdminPage";
import AdminRoute from "../admin/AdminRoute";
import Error from "../pages/Error";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "ingredients", element: <Ingredients /> },
      { path: "products/:id", element: <Product /> },
      { path: "profile", element: <Profile /> },
      { path: "composition/:id", element: <CompositionDetails /> },
      { path: "register", element: <Register /> },
      { path: "error", element: <Error /> },

      {
        path: "admin/ingredients",
        element: (
          <AdminRoute>
            <IngredientAdminPage />
          </AdminRoute>
        ),
      },
      {
        path: "admin/products",
        element: (
          <AdminRoute>
            <ProductsAdminPage />
          </AdminRoute>
        ),
      },
    ],
    errorElement: <ErrorLayout />,
  },
]);

export default routes;
