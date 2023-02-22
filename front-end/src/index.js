import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./assets/fonts/Joystix/joystix.ttf";
import Landing from "./routes/Landing";
import Home from "./routes/Home"
import Game from "./routes/Game"
import Contact from "./routes/Contact"
import { Root } from "./routes/root";

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
      {
        path: "/contact-us",
        element: <Contact />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
