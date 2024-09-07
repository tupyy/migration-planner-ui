import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ConnectStepContent } from "./steps/connect/ConnectStepContent";
import { DiscoveryStepContent } from "./steps/discovery/DiscoveryStepContent";
import { useComputedHeightFromPageHeader } from "./hooks/useComputedHeightFromPageHeader";

export const MigrationWizard: React.FC = () => {
  const height = useComputedHeightFromPageHeader();

  return (
    <Wizard height={height} title="Migration wizard">
      <WizardStep
        name="Connect"
        id="connect-step"
        footer={{ isCancelHidden: true, isNextDisabled: true }}
      >
        <ConnectStepContent />
      </WizardStep>
      <WizardStep name="Discovery" id="discovery-step">
        <DiscoveryStepContent />
      </WizardStep>
    </Wizard>
  );
};

MigrationWizard.displayName = "MigrationWizard";
