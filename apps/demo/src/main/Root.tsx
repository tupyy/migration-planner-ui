import "@patternfly/react-core/dist/styles/base.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Configuration } from "@migration-planner-ui/api-client/runtime";
import { SourceApi, ImageApi } from "@migration-planner-ui/api-client/apis";
import { AgentApi } from "#/services/agent/AgentApi";
import { Container, Provider as DependencyInjectionProvider } from "#/ioc";
import { PLANNER_BASEPATH, AGENT_BASEPATH } from "./Constants";
import { router } from "./Router";
import { Symbols } from "./Symbols";

function getConfiguredContainer(): Container {
  const container = new Container();
  const plannerApisConfig = new Configuration({
    basePath: PLANNER_BASEPATH,
  });
  const agentApiConfig = new Configuration({ basePath: AGENT_BASEPATH });

  container
    .register(Symbols.SourceApi, new SourceApi(plannerApisConfig))
    .register(Symbols.ImageApi, new ImageApi(plannerApisConfig))
    .register(Symbols.AgentApi, new AgentApi(agentApiConfig));

  return container;
}

function main(): void {
  const root = document.getElementById("root");
  if (root) {
    const container = getConfiguredContainer();
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <DependencyInjectionProvider container={container}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </React.Suspense>
        </DependencyInjectionProvider>
      </React.StrictMode>
    );
  }
}

main();
