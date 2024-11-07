import { HomePage, ServerPage, LoginPage, RegisterPage } from "../Pages";
// import PrivateRoute from "./PrivateRoute";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/server/:serverId",
    element: <ServerPage />,
  },
  // This should be protected but for development leave it open
  // {
  //   path: "/server",
  //   element: (
  //     <PrivateRoute>
  //       <ServerPage />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: "/",
  //   element: (
  //     <PrivateRoute>
  //       <HomePage />
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];
