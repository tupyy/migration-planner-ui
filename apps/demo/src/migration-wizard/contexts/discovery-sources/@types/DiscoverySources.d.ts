declare namespace DiscoverySources {
  type Context = {
    sources: Source[];
    isLoadingSources: boolean;
    errorLoadingSources?: Error;
    isDeletingSource: boolean;
    errorDeletingSource?: Error;
    isCreatingSource: boolean;
    errorCreatingSource?: Error;
    isDownloadingSource: boolean;
    errorDownloadingSource?: Error;
    isPolling: boolean;
    listSources: () => Promise<Source[]>;
    deleteSource: (id: string) => Promise<Source>;
    createSource: (name: string) => Promise<Source>;
    downloadSource: (sourceName: string) => Promise<void>;
    startPolling: (delay: number) => void;
    stopPolling: () => void;
  };
}
