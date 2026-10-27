import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import ErrorPage from "./components/error-page";
import FormLayout from "./components/form-layout";
import Layout from "./components/layout";
import PublicLayout from "./components/public-layout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AddBookPage from "./pages/Book/AddBookPage";
import BookPage from "./pages/Book/BookPage";
import BooksPage from "./pages/Book/BooksPage";
import UpdateBookPage from "./pages/Book/UpdateBookPage";
import CheckoutsPage from "./pages/checkouts/CheckoutsPage";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddMemberPage from "./pages/Member/AddMemberPage";
import MembersPage from "./pages/Member/MembersPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import EditMemberPage from "./pages/Member/EditMemberPage";
import CataloguePage from "./pages/library/CataloguePage";
import CatalogueBookPage from "./pages/library/CatalogueBookPage";
import MyLoansPage from "./pages/library/MyLoansPage";
import LoanRequestsPage from "./pages/library/LoanRequestsPage";
import NotFound from "./components/not-found";

function LegacyAdminRoute() {
  const location = useLocation();
  return (
    <Navigate to={`/admin${location.pathname}${location.search}`} replace />
  );
}

const routes = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <CataloguePage /> },
      { path: "/books", element: <CataloguePage /> },
      { path: "/books/:id", element: <CatalogueBookPage /> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/my-loans", element: <MyLoansPage /> },
          { path: "/account", element: <SettingsPage /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <ProtectedRoutes adminOnly />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "books", element: <BooksPage /> },
          { path: "books/add", element: <AddBookPage /> },
          { path: "books/:id", element: <BookPage /> },
          { path: "books/:id/edit", element: <UpdateBookPage /> },
          { path: "members", element: <MembersPage /> },
          { path: "members/add", element: <AddMemberPage /> },
          { path: "members/:id/edit", element: <EditMemberPage /> },
          { path: "checkouts", element: <CheckoutsPage /> },
          { path: "loan-requests", element: <LoanRequestsPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <FormLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  ...[
    "/members",
    "/members/add",
    "/members/:id/edit",
    "/checkouts",
    "/categories",
    "/reports",
    "/books/add",
    "/books/:id/edit",
  ].map((path) => ({ path, element: <LegacyAdminRoute /> })),
  { path: "/settings", element: <Navigate to="/account" replace /> },
  { path: "/profile", element: <Navigate to="/account" replace /> },
]);

export default routes;
