import React from "react";
import { AppPage } from "#/common/components/AppPage";
import { MigrationWizard } from "#/migration-wizard/MigrationWizard";

export const MigrationWizardPage: React.FC = () => {
  return (
    <AppPage
      breadcrumbs={[
        { key: 1, to: "/migrate", children: "Migration assessment" },
        { key: 2, to: "#", children: "Guide", isActive: true },
      ]}
      title="Welcome, let's start your migration journey from VMware to OpenShift."
    >
      <MigrationWizard />
    </AppPage>
  );
};

MigrationWizardPage.displayName = "MigrationWizardPage";
