import { HomePage, ServerPage, LoginPage, RegisterPage } from "../Pages";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/server",
    element: <ServerPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];
