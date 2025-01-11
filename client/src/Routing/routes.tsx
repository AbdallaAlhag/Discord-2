import {
  HomePage,
  ServerPage,
  LoginPage,
  RegisterPage,
  DiscoverPage,
  ErrorPage,
} from "../Pages";
import PrivateRoute from "./PrivateRoute";


export const routes = [
  // {
  //   path: "/",
  //   element: <HomePage />,
  // },
  // {
  //   path: "/@me/:friendIdLink?",
  //   element: <HomePage />,
  // },
  // {
  //   path: "/server/:serverId/:channelId",
  //   element: <ServerPage />,
  // },
  // This should be protected but for development leave it open
  {
    path: "/server/:serverId/:channelId",
    element: (
      <PrivateRoute>
        <ServerPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/@me/:friendIdLink?",
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
  {
    // give it a default value of 0 so we can use params with the hover effect lmao
    path: "/discover/:serverId",
    element: (
      <PrivateRoute>
        <DiscoverPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Catch-all route for undefined paths
  {
    path: "*",
    element: <ErrorPage />,
  },
];
