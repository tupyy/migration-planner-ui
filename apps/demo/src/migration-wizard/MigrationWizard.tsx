import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ConnectStep } from "./steps/connect/ConnectStep";
import { DiscoveryStep } from "./steps/discovery/DiscoveryStep";
import { useComputedHeightFromPageHeader } from "./hooks/UseComputedHeightFromPageHeader";
import { useDiscoverySources } from "./hooks/UseDiscoverySources";

export const MigrationWizard: React.FC = () => {
  const computedHeight = useComputedHeightFromPageHeader();
  const discoverSourcesContext = useDiscoverySources();
  const [firstSource, ..._otherSources] = discoverSourcesContext.sources;
  const isDiscoverySourceUpToDate = firstSource?.status === "up-to-date";

  return (
    <Wizard height={computedHeight}>
      <WizardStep
        name="Connect"
        id="connect-step"
        footer={{
          isCancelHidden: true,
          isNextDisabled: !isDiscoverySourceUpToDate,
        }}
      >
        <ConnectStep />
      </WizardStep>
      <WizardStep
        name="Discover"
        id="discover-step"
        footer={{ isCancelHidden: true }}
      >
        <DiscoveryStep />
      </WizardStep>
      <WizardStep name="Plan" id="plan-step" footer={{ isCancelHidden: true }}>
        <div>Plan step</div>
      </WizardStep>
    </Wizard>
  );
};

MigrationWizard.displayName = "MigrationWizard";
