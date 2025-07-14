import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddBookPage from "./pages/Book/AddBookPage";
import BooksPage from "./pages/Book/BooksPage";
import CheckoutsPage from "./pages/CheckoutsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import MembersPage from "./pages/Member/MembersPage";
import ReportsPage from "./pages/ReportsPage";
import Layout from "./components/layout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ErrorPage from "./components/error-page";
import FormLayout from "./components/form-layout";
import BookPage from "./pages/Book/BookPage";
import UpdateBookPage from "./pages/Book/UpdateBookPage";
import AddMemberPage from "./pages/Member/AddMemberPage";

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
          // books
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
            path: "/books/:id/edit",
            element: <UpdateBookPage />,
          },
          // membership
          {
            path: "/members",
            element: <MembersPage />,
          },
          {
            path: "/members/add",
            element: <AddMemberPage />,
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
