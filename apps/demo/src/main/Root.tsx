import "reflect-metadata";
import "@patternfly/react-core/dist/styles/base.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider as DependencyProvider } from "inversify-react";
import { container } from "./IoC";
import { router } from "./Router";

const root = document.getElementById("root");
if (root) {
  root.style.height = "inherit";
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <DependencyProvider container={container}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </React.Suspense>
      </DependencyProvider>
    </React.StrictMode>
  );
}
