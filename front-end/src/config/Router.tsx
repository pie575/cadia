import * as React from "react";

import Landing from "../routes/Landing";
import Home from "../routes/Home"
import Game from "../routes/Game"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/home", element: <Home /> },
      {
        path: "/game",
        element: <Game />,
      },
      // {
      //   path: "/contact-us",
      //   element: <Contact />,
      // },
    ],
  },
]);

interface RouteSchema {
  path: string;
  component: JSX.Element;
  isAuthRequired?: boolean;
}

const routes: RouteSchema[] = [
  { path: "/landing", component: <Landing /> },
  { path: "/", component: <Home /> },
  { path: "/game", component: <Game />, isAuthRequired: true },
];
