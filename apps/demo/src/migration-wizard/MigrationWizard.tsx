import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ConnectStep } from "#/migration-wizard/steps/connect/ConnectStep";
import { DiscoveryStep } from "#/migration-wizard/steps/discovery/DiscoveryStep";
import { useComputedHeightFromPageHeader } from "#/migration-wizard/Hooks";
import { useInjection } from "#/ioc";
import { Symbols } from "#/main/Symbols";
import { SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { useAsyncRetry } from "react-use";

export const MigrationWizard: React.FC = () => {
  const computedHeight = useComputedHeightFromPageHeader();
  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);
  const state = useAsyncRetry(async () => {
    const sources = await sourceApi.listSources();
    return sources;
  }, []);
  const hasSources = (state.value ?? []).length > 0;
  const atLeastOnceSourceIsReady =
    state.value?.some((src) => src.status === "up-to-date") ?? false;

  return (
    <Wizard height={computedHeight} title="Migration wizard">
      <WizardStep
        name="Connect"
        id="connect-step"
        footer={{
          isCancelHidden: true,
          isNextDisabled: !hasSources || !atLeastOnceSourceIsReady,
        }}
      >
        <ConnectStep sources={state} />
      </WizardStep>
      <WizardStep
        name="Discovery"
        id="discovery-step"
        footer={{ isCancelHidden: true }}
      >
        <DiscoveryStep />
      </WizardStep>
    </Wizard>
  );
};

MigrationWizard.displayName = "MigrationWizard";
