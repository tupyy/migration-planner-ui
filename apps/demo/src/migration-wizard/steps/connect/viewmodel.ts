import { serviceIdentifiers } from "#/main/IoC";
import { Time } from "#/common/Time";
import type { SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import type { Source } from "@migration-planner-ui/api-client/models";
import { useInjection } from "inversify-react";
import { useCallback, useState } from "react";
import { useAsync, useBoolean, useList, useInterval } from "react-use";

export interface ConnectStepViewModelInterface {
  loadingSources: boolean;
  errorLoadingSources?: Error;
  sources: Source[];
  handleAddSources: () => void;
}

export const useViewModel = (): ConnectStepViewModelInterface => {
  const sourceApiClient = useInjection<SourceApiInterface>(
    serviceIdentifiers.SourceApi
  );
  const { loading, value, error } = useAsync(() => {
    return sourceApiClient.listSources();
  });
  const [loadingSources, setLoadingSources] = useBoolean(loading);
  const [sources, sourcesActions] = useList(value ?? []);
  const [errorLoadingSources, setErrorLoadingSources] = useState<
    Error | undefined
  >(error);

  useInterval(
    async () => {
      setLoadingSources(true);
      try {
        const sources = await sourceApiClient.listSources();
        sourcesActions.push(...sources);
      } catch (error) {
        setErrorLoadingSources(error as Error);
      } finally {
        setLoadingSources(false);
      }
    },
    sources.length > 0 ? null : 5 * Time.Second
  );

  return {
    loadingSources,
    errorLoadingSources,
    sources,
    handleAddSources: useCallback(() => { }, []),
  };
};
