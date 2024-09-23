import React, { type PropsWithChildren } from "react";
import { useAsyncFn } from "react-use";
import { type Source } from "@migration-planner-ui/api-client/models";
import { type SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { useInjection } from "@migration-planner-ui/ioc";
import { Symbols } from "#/main/Symbols";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DiscoverySources {
  export type Context = {
    sources: Source[];
    isLoadingSources: boolean;
    errorLoadingSources?: Error;
    isDeletingSource: boolean;
    errorDeletingSource?: Error;
    isCreatingSource: boolean;
    errorCreatingSource?: Error;
    isDownloadingSource: boolean;
    errorDownloadingSource?: Error;
    listSources: () => Promise<Source[]>;
    deleteSource: (id: string) => Promise<Source>;
    createSource: (name: string) => Promise<Source>;
    downloadSource: (sourceName: string) => Promise<void>;
  };
}

export const DiscoverySourcesContext =
  React.createContext<DiscoverySources.Context | null>(null);

export const DiscoverySourcesProvider: React.FC<PropsWithChildren> = (
  props
) => {
  const { children } = props;
  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);

  const [listSourcesState, listSources] = useAsyncFn(async () => {
    const sources = await sourceApi.listSources();
    return sources;
  });

  const [deleteSourceState, deleteSource] = useAsyncFn(async (id: string) => {
    const deletedSource = await sourceApi.deleteSource({ id });
    return deletedSource;
  });

  const [createSourceState, createSource] = useAsyncFn(async (name: string) => {
    const createdSource = await sourceApi.createSource({
      sourceCreate: { name },
    });
    return createdSource;
  });

  const [downloadSourceState, downloadSource] = useAsyncFn(
    async (sourceName: string): Promise<void> => {
      const anchor = document.createElement("a");
      anchor.download = sourceName + ".ova";
      const newSource = await createSource(sourceName);
      // TODO(jkilzi): Extract to a sevice that builds the URL (the '/planner/' prefix needs to be removed in prod)
      // const image = await sourceApi.getSourceImage({ id: newSource.id });
      // anchor.href = URL.createObjectURL(image);
      anchor.href = `/planner/api/v1/sources/${newSource.id}/image`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }
  );

  const ctx: Readonly<DiscoverySources.Context> = {
    sources: listSourcesState.value ?? [],
    isLoadingSources: listSourcesState.loading,
    errorLoadingSources: listSourcesState.error,
    isDeletingSource: deleteSourceState.loading,
    errorDeletingSource: deleteSourceState.error,
    isCreatingSource: createSourceState.loading,
    errorCreatingSource: createSourceState.error,
    isDownloadingSource: downloadSourceState.loading,
    errorDownloadingSource: downloadSourceState.error,
    listSources,
    deleteSource,
    createSource,
    downloadSource,
  };

  return (
    <DiscoverySourcesContext.Provider value={Object.freeze(ctx)}>
      {children}
    </DiscoverySourcesContext.Provider>
  );
};

DiscoverySourcesProvider.displayName = "DiscoverySourcesProvider";
