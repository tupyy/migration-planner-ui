import React, { useCallback, useEffect, useState } from "react";
import type { Source } from "@migration-planner-ui/api-client/models";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  Button,
  Icon,
  TextContent,
  Text,
  Tooltip,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { useAsyncFn } from "react-use";
import { type AsyncStateRetry } from "react-use/lib/useAsyncRetry";
import { type SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { useInjection } from "@migration-planner-ui/ioc";
import { Symbols } from "#/main/Symbols";
import { ConfirmationModal } from "#/common/ConfirmationModal";
import { Columns } from "./Columns";
import { VALUE_NOT_AVAILABLE } from "./Constants";
import { SourcesTableEmptyState } from "./EmptyState";
import { DiscoverySourceSetupModal } from "./DiscoverySourceSetupModal";
import { SourceStatusView } from "./SourceStatusView";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SourcesTable {
  export type Props = {
    sources: AsyncStateRetry<Source[]>;
  };
}

export const SourcesTable: React.FC<SourcesTable.Props> = (props) => {
  const { sources } = props;
  const hasSources = (sources.value ?? []).length > 0;

  const [shouldShowConfirmationModal, setShouldShowConfirmationModal] =
    useState(false);
  const toggleConfirmationModal = useCallback((): void => {
    setShouldShowConfirmationModal((lastState) => !lastState);
  }, []);

  const [
    shouldShowDiscoverySourceSetupModal,
    setShouldShowDiscoverySetupModal,
  ] = useState(false);
  const toggleDiscoverySourceSetupModal = useCallback((): void => {
    setShouldShowDiscoverySetupModal((lastState) => !lastState);
  }, []);

  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);

  const [deleteSourceHandlerState, handleDeleteSource] = useAsyncFn(
    async (id: string) => {
      const deletedSource = await sourceApi.deleteSource({ id });
      return deletedSource;
    }
  );

  const [downloadHandlerState, handleDownload] = useAsyncFn(
    async (event: React.FormEvent<HTMLFormElement>) => {
      const form = event.currentTarget;
      const name = form["discoverySourceName"].value;

      const newSource = await sourceApi.createSource({
        sourceCreate: { name },
      });

      // TODO(jkilzi): Ask to replace the 'getSourceImage' with 'getSourceImageUrl'
      // const image = await sourceApi.getSourceImage({ id: source.id });
      // return image;
      const anchor = document.createElement("a");
      anchor.download = newSource.name + ".ova";
      anchor.href = `/planner/api/v1/sources/${newSource.id}/image`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      toggleDiscoverySourceSetupModal();
      return newSource;
    }
  );

  const handleEmptyStateDetectionError = useCallback(() => {
    if (!sources.loading) {
      sources.retry();
    }
  }, [sources]);

  let emptyStateVariant: "loading" | "error" | undefined;
  if (sources.loading) {
    emptyStateVariant = "loading";
  } else if (sources.error) {
    emptyStateVariant = "error";
  }

  useEffect(() => {
    if (
      sources.loading ||
      downloadHandlerState.loading ||
      deleteSourceHandlerState.loading
    ) {
      return;
    }

    sources.retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadHandlerState, deleteSourceHandlerState]);

  return (
    <Table aria-label="Sources table" variant="compact" borders={false}>
      {hasSources && (
        <Thead>
          <Tr>
            <Th>{Columns.Name}</Th>
            <Th>{Columns.Status}</Th>
            <Th>{Columns.Hosts}</Th>
            <Th>{Columns.VMs}</Th>
            <Th>{Columns.Networks}</Th>
            <Th>{Columns.Datastores}</Th>
            <Th>{Columns.Actions}</Th>
          </Tr>
        </Thead>
      )}
      <Tbody>
        {hasSources ? (
          sources.value!.map((src) => (
            <Tr key={src.id}>
              <Td dataLabel={Columns.Name}>{src.name}</Td>
              <Td dataLabel={Columns.Status}>
                <SourceStatusView
                  status={src.status}
                  statusInfo={
                    src.statusInfo.length === 0
                      ? "Something interesting about this status shows up here. 🪬🪬🪬" // TODO(jkilzi): Remove this after demo...
                      : src.statusInfo
                  }
                />
              </Td>
              <Td dataLabel={Columns.Hosts}>
                {src.inventory?.infra.totalHosts || VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={Columns.VMs}>
                {src.inventory?.vms.total || VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={Columns.Networks}>
                {(src.inventory?.infra.networks ?? []).length ||
                  VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={Columns.Datastores}>
                {(src.inventory?.infra.datastores ?? []).length ||
                  VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={Columns.Actions}>
                <Tooltip content="Remove">
                  <Button
                    data-source-id={src.id}
                    variant="plain"
                    isDisabled={deleteSourceHandlerState.loading}
                    onClick={toggleConfirmationModal}
                  >
                    <Icon size="md" isInline>
                      <TrashIcon />
                    </Icon>
                  </Button>
                </Tooltip>
                {shouldShowConfirmationModal && (
                  <ConfirmationModal
                    titleIconVariant="warning"
                    primaryButtonVariant="danger"
                    title="Remove discovery source?"
                    isOpen={shouldShowConfirmationModal}
                    onCancel={toggleConfirmationModal}
                    onConfirm={(event) => {
                      event.stopPropagation();
                      handleDeleteSource(src.id);
                      toggleConfirmationModal();
                    }}
                  >
                    <TextContent>
                      <Text id="confirmation-modal-description">
                        The discovery information will be lost.
                      </Text>
                    </TextContent>
                  </ConfirmationModal>
                )}
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={12}>
              <SourcesTableEmptyState
                variant={emptyStateVariant}
                isCreateDiscoverySourceDisabled={downloadHandlerState.loading}
                onCreateDiscoverySource={toggleDiscoverySourceSetupModal}
                onDetectionError={handleEmptyStateDetectionError}
              />

              {shouldShowDiscoverySourceSetupModal && (
                <DiscoverySourceSetupModal
                  isOpen={shouldShowDiscoverySourceSetupModal}
                  onClose={toggleDiscoverySourceSetupModal}
                  onSubmit={handleDownload}
                />
              )}
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = "SourcesTable";
