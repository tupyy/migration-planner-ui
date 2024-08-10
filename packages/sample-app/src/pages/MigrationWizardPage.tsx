import React from "react";
import { BasePage } from "#/common/page/BasePage";
import { MigrationWizard } from "#/common/migration-wizard/MigrationWizard";

export const MigrationWizardPage: React.FC = () => {
  return (
    <BasePage
      breadcrumbs={[
        { key: 1, to: "#", children: "VMware to OpenShift migration" },
        { key: 2, to: "#", children: "Migration guide", isActive: true },
      ]}
      title="Evaluate VMware to OpenShift migration"
      caption={
        <p>
          This step-by-step guide will help you asses your VMware vCenter and
          provide you with a migration readiness report.
          <br />
          By the end of this process we'll guide you through the steps required
          for creating the OpenShift cluster that will orchestrate the migrated
          VMs.
        </p>
      }
    >
      <MigrationWizard />
    </BasePage>
  );
};
