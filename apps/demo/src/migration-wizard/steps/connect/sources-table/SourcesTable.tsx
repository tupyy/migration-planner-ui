import React, { useCallback, useEffect, useState } from "react";
import type { Source } from "@migration-planner-ui/api-client/models";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  Button,
  Icon,
  Spinner,
  Split,
  SplitItem,
  TextContent,
  Text,
  Tooltip,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { useAsyncFn } from "react-use";
import { type AsyncStateRetry } from "react-use/lib/useAsyncRetry";
import { type SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { useInjection } from "#/ioc";
import { Symbols } from "#/main/Symbols";
import { SourcesTableColumns } from "./SourcesTableColumns";
import { VALUE_NOT_AVAILABLE } from "./Constants";
import { SourcesTableEmptyState } from "./EmptyState";
import { DiscoverySourceSetupModal } from "./DiscoverySourceSetupModal";
import { ConfirmationModal } from "./ConfirmationDialog";

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
    setShouldShowConfirmationModal(!shouldShowConfirmationModal);
  }, [shouldShowConfirmationModal]);

  const [
    shouldShowDiscoverySourceSetupModal,
    setShouldShowDiscoverySetupModal,
  ] = useState(false);
  const toggleDiscoverySourceSetupModal = useCallback((): void => {
    setShouldShowDiscoverySetupModal(!shouldShowDiscoverySourceSetupModal);
  }, [shouldShowDiscoverySourceSetupModal]);

  const sourceApi = useInjection<SourceApiInterface>(Symbols.SourceApi);

  const [deleteSourceHandlerState, handleDeleteSource] = useAsyncFn(
    async (id: string) => {
      const deletedSource = await sourceApi.deleteSource({ id });
      return deletedSource;
    }
  );

  const [downloadHandlerState, handleDownload] = useAsyncFn(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation()
      const form = event.currentTarget;
      const name = form["discoverySourceName"].value;

      const newSource = await sourceApi.createSource({
        sourceCreate: { name },
      });

      const anchor = document.createElement("a");
      anchor.download = newSource.name + ".ova";
      anchor.href = `/planner/api/v1/sources/${newSource.id}/image`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      return newSource;

      // TODO(jkilzi): Ask to replace the 'getSourceImage' with 'getSourceImageUrl'
      // const image = await sourceApi.getSourceImage({ id: source.id });
      // return image;
    }
  );

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
            <Th>{SourcesTableColumns.Name}</Th>
            <Th>{SourcesTableColumns.Status}</Th>
            <Th>{SourcesTableColumns.Hosts}</Th>
            <Th>{SourcesTableColumns.VMs}</Th>
            <Th>{SourcesTableColumns.Networks}</Th>
            <Th>{SourcesTableColumns.Datastores}</Th>
            <Th>{SourcesTableColumns.Actions}</Th>
          </Tr>
        </Thead>
      )}
      <Tbody>
        {hasSources ? (
          sources.value!.map((src) => (
            <Tr key={src.id}>
              <Td dataLabel={SourcesTableColumns.Name}>{src.name}</Td>
              <Td dataLabel={SourcesTableColumns.Status}>
                <Split hasGutter>
                  <SplitItem>
                    <Spinner isInline />
                  </SplitItem>
                  <SplitItem>{src.status}</SplitItem>
                </Split>
              </Td>
              <Td dataLabel={SourcesTableColumns.Hosts}>
                {src.inventory?.infra.totalHosts || VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.VMs}>
                {src.inventory?.vms.total || VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.Networks}>
                {(src.inventory?.infra.networks ?? []).length ||
                  VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.Datastores}>
                {(src.inventory?.infra.datastores ?? []).length ||
                  VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.Actions}>
                <Tooltip content="Remove">
                  <Button
                    data-source-id={src.id}
                    variant="plain"
                    isDisabled={deleteSourceHandlerState.loading}
                    onClick={toggleConfirmationModal}
                  >
                    <Icon size="md" isInline status="danger">
                      <TrashIcon />
                    </Icon>
                  </Button>
                </Tooltip>
                <ConfirmationModal
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
                    <Text
                      id="confirmation-modal-description"
                      style={{ textAlign: "center" }}
                    >
                      The discovery information will be lost.
                    </Text>
                  </TextContent>
                </ConfirmationModal>
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
              />

              <DiscoverySourceSetupModal
                isOpen={shouldShowDiscoverySourceSetupModal}
                onClose={toggleDiscoverySourceSetupModal}
                onSubmit={handleDownload}
              />
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = "SourcesTable";
