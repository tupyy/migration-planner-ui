import React from "react";
import { Bullseye } from "@patternfly/react-core";
import { BasePage } from "#/kitchensink/BasePage";
import { VMwareMigrationCard } from "#/ocm/components/VMwareMigrationCard";

export const OcmPreviewPage: React.FC = () => {
  return (
    <BasePage title="VMware Migration Assessment Card for OCM">
      <Bullseye>
        <VMwareMigrationCard />
      </Bullseye>
    </BasePage>
  );
};

OcmPreviewPage.displayName = "OcmPreviewPage";
