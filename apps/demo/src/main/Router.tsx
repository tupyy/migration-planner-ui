/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/migrate" />,
  },
  {
    path: "/migrate",
    lazy: async () => {
      const { default: MigrationAssessmentPage } = await import(
        "#/pages/MigrationAssessmentPage"
      );

      return {
        Component: MigrationAssessmentPage,
      };
    },
  },
  {
    path: "/migrate/wizard",
    lazy: async () => {
      const { default: MigrationWizardPage } = await import(
        "#/pages/MigrationWizardPage"
      );

      return {
        Component: MigrationWizardPage,
      };
    },
  },
  {
    path: "/ocm",
    lazy: async () => {
      const { default: OcmPreviewPage } = await import(
        "#/pages/OcmPreviewPage"
      );

      return {
        Component: OcmPreviewPage,
      };
    },
  },
  {
    path: "/error/:code",
    lazy: async () => {
      const { default: ErrorPage } = await import("../components/ErrorPage");

      return {
        Component: ErrorPage,
      };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { default: ErrorPage } = await import("../components/ErrorPage");

      return {
        element: (
          <ErrorPage
            code="404"
            message="We lost that page"
            actions={[
              {
                children: "Go back",
                component: "a",
                onClick: (_event): void => {
                  history.back();
                },
              },
            ]}
          />
        ),
      };
    },
  },
]);
