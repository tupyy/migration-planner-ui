import React from "react";
import { BasePage } from "#/common/components/BasePage";
import { MigrationWizard } from "#/migration-wizard/MigrationWizard";

export const MigrationWizardPage: React.FC = () => {
  return (
    <BasePage
      breadcrumbs={[
        { key: 1, to: "/migrate", children: "Migration assessment" },
        { key: 2, to: "#", children: "Guide", isActive: true },
      ]}
      title="Welcome, let's start your migration journey from VMware to OpenShift."
    >
      <MigrationWizard />
    </BasePage>
  );
};

MigrationWizardPage.displayName = "MigrationWizardPage";
