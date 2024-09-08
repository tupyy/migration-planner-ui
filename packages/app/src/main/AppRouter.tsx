import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MigrationAssessmentPage } from "#/pages/MigrationAssessmentPage";
import { MigrationWizardPage } from "#/pages/MigrationWizardPage";
import { ErrorPage } from "#/pages/ErrorPage";
import { OcmPreviewPage } from "#/pages/OcmPreviewPage";
import { VmPreviewPage } from "#/pages/VmPreviewPage";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/migrate" />} />
      <Route path="/migrate" element={<MigrationAssessmentPage />} />
      <Route path="/migrate/wizard" element={<MigrationWizardPage />} />

      {/* These are not exposed in the App */}
      <Route path="/preview" element={<Navigate to="/preview/ocm" />} />
      <Route path="/preview/ocm" element={<OcmPreviewPage />} />
      <Route path="/preview/vm" element={<VmPreviewPage />} />

      <Route path="/error/:code" element={<ErrorPage />} />

      <Route
        path="*"
        element={
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
        }
      />
    </Routes>
  );
};

AppRouter.displayName = "AppRouter";
