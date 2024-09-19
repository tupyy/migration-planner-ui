import React from "react";
import { useAsyncRetry } from "react-use";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { ConnectStep } from "#/migration-wizard/steps/connect/ConnectStep";
import { DiscoveryStep } from "#/migration-wizard/steps/discovery/DiscoveryStep";
import { useComputedHeightFromPageHeader } from "#/migration-wizard/hooks/UseComputedHeightFromPageHeader";
import { useInjection } from "@migration-planner-ui/ioc";
import { Symbols } from "#/main/Symbols";

export const MigrationWizard: React.FC = () => {
  const computedHeight = useComputedHeightFromPageHeader();
  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);
  const state = useAsyncRetry(async () => {
    const sources = await sourceApi.listSources();
    return sources;
  }, []);
  const hasSources = (state.value ?? []).length > 0;
  const discoverySourceIsUpToDate = state.value?.[0]?.status === "up-to-date";

  return (
    <Wizard height={computedHeight}>
      <WizardStep
        name="Connect"
        id="connect-step"
        footer={{
          isCancelHidden: true,
          isNextDisabled: !hasSources || !discoverySourceIsUpToDate,
        }}
      >
        <ConnectStep sources={state} />
      </WizardStep>
      <WizardStep
        name="Discover"
        id="discovery-step"
        footer={{ isCancelHidden: true }}
      >
        <DiscoveryStep />
      </WizardStep>
      <WizardStep name="Plan" id="plan-step" footer={{ isCancelHidden: true }}>
        <DiscoveryStep />
      </WizardStep>
    </Wizard>
  );
};

MigrationWizard.displayName = "MigrationWizard";
