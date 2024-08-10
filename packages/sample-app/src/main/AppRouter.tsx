import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MigrationAssessmentPage } from "#/pages/MigrationAssessmentPage";
import { MigrationWizardPage } from "#/pages/MigrationWizardPage";
import { ErrorPage } from "#/pages/ErrorPage";
import { OcmDemoPage } from "#/pages/OcmDemoPage";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/migrate" />} />
      <Route path="/migrate" element={<MigrationAssessmentPage />} />
      <Route path="/migrate/wizard" element={<MigrationWizardPage />} />
      <Route path="/preview" element={<Navigate to="/preview/ocm-card" />} />
      <Route path="/preview/ocm-card" element={<OcmDemoPage />} />
      <Route
        path="*"
        element={
          <ErrorPage
            code="404"
            message="We lost that page"
            actions={[{ children: "Go back", component: "a", href: "/" }]}
          />
        }
      />
    </Routes>
  );
};

AppRouter.displayName = "AppRouter";
