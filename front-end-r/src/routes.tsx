import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddBookPage from "./pages/AddBookPage";
import BooksPage from "./pages/BooksPage";
import CheckoutsPage from "./pages/CheckoutsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import MembersPage from "./pages/MembersPage";
import ReportsPage from "./pages/ReportsPage";
import Layout from "./components/layout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ErrorPage from "./components/error-page";
import FormLayout from "./components/form-layout";
import BookPage from "./pages/BookPage";

const routes = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/books",
            element: <BooksPage />,
          },
          {
            path: "/books/add",
            element: <AddBookPage />,
          },
          {
            path: "/books/:id",
            element: <BookPage />,
          },
          {
            path: "/members",
            element: <MembersPage />,
          },
          {
            path: "/checkouts",
            element: <CheckoutsPage />,
          },
          {
            path: "/reports",
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
  {
    element: <FormLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/logout",
        element: <LogoutPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

export default routes;
