import React from "react";
import { Bullseye } from "@patternfly/react-core";
import { BasePage } from "#/common/page/BasePage";
import { VMwareMigrationCard } from "#/common/ocm-card/VMwareMigrationCard";

export const OcmDemoPage: React.FC = () => {
  return (
    <BasePage title="VMware Migration Assessment Card for OCM">
      <Bullseye>
        <VMwareMigrationCard />
      </Bullseye>
    </BasePage>
  );
};

OcmDemoPage.displayName = "OcmDemoPage";
