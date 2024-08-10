import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ConnectStepContent } from "./steps/connect-step/ConnectStepContent";
import { DiscoveryStepContent } from "./steps/DiscoveryStepContent";
import { useComputedHeightFromPageHeader } from "./hooks/useComputedHeightFromPageHeader";
// import { ReviewStepContent } from "./steps/ReviewStepContent";

export const MigrationWizard: React.FC = () => {
  const height = useComputedHeightFromPageHeader();

  return (
    <Wizard height={height} title="Migration wizard">
      <WizardStep
        name="Connect your vCenter"
        id="connect-step"
        footer={{ isCancelHidden: true, isNextDisabled: true }}
      >
        <ConnectStepContent />
      </WizardStep>
      <WizardStep name="Discovery" id="discovery-step">
        <DiscoveryStepContent />
      </WizardStep>
      {/* <WizardStep
        name="Review"
        id="review-step"
        footer={{ nextButtonText: "Finish" }}
      >
        <ReviewStepContent />
      </WizardStep> */}
    </Wizard>
  );
};
