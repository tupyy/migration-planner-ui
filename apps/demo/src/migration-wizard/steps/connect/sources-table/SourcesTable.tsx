import React from "react";
import { useMount } from "react-use";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useDiscoverySources } from "#/migration-wizard/hooks/UseDiscoverySources";
import { EmptyState } from "./empty-state/EmptyState";
import { RemoveSourceAction } from "./actions/RemoveSourceAction";
import { Columns } from "./Columns";
import { VALUE_NOT_AVAILABLE } from "./Constants";
import { SourceStatusView } from "./SourceStatusView";

export const SourcesTable: React.FC = () => {
  const discoverySourcesContext = useDiscoverySources();
  const hasSources = discoverySourcesContext.sources.length > 0;

  useMount(() => {
    discoverySourcesContext.listSources();
  });

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
          discoverySourcesContext.sources.map((src) => (
            <Tr key={src.id}>
              <Td dataLabel={Columns.Name}>{src.name}</Td>
              <Td dataLabel={Columns.Status}>
                <SourceStatusView
                  status={src.status}
                  statusInfo={src.statusInfo}
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
                <RemoveSourceAction
                  sourceId={src.id}
                  isDisabled={discoverySourcesContext.isDeletingSource}
                  onConfirm={async (event) => {
                    event.stopPropagation();
                    await discoverySourcesContext.deleteSource(src.id);
                    event.dismissConfirmationModal();
                    await discoverySourcesContext.listSources();
                  }}
                />
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={12}>
              <EmptyState />
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = "SourcesTable";
