import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ConnectStepContent } from "./steps/connect/ConnectStepContent";
import { DiscoveryStepContent } from "./steps/discovery/DiscoveryStepContent";
import { useComputedHeightFromPageHeader } from "./useComputedHeightFromPageHeader";
import { useViewModel as useConnectStepViewModel } from "./steps/connect/ViewModel";

export const MigrationWizard: React.FC = () => {
  const computedHeight = useComputedHeightFromPageHeader();
  const connectStepViewModel = useConnectStepViewModel();

  return (
    <Wizard height={computedHeight} title="Migration wizard">
      <WizardStep
        name="Connect"
        id="connect-step"
        footer={{ isCancelHidden: true, isNextDisabled: false }}
      >
        <ConnectStepContent vm={connectStepViewModel} />
      </WizardStep>
      <WizardStep
        name="Discovery"
        id="discovery-step"
        footer={{ isCancelHidden: true }}
      >
        <DiscoveryStepContent />
      </WizardStep>
    </Wizard>
  );
};

MigrationWizard.displayName = "MigrationWizard";
