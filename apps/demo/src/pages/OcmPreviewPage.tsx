import React from "react";
import { Bullseye } from "@patternfly/react-core";
import { AppPage } from "#/common/components/AppPage";
import { VMwareMigrationCard } from "#/ocm/components/VMwareMigrationCard";

export const OcmPreviewPage: React.FC = () => {
  return (
    <AppPage title="VMware Migration Assessment Card for OCM">
      <Bullseye>
        <VMwareMigrationCard />
      </Bullseye>
    </AppPage>
  );
};

OcmPreviewPage.displayName = "OcmPreviewPage";
