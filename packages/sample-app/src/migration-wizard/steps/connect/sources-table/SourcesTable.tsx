import React from "react";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { SourcesTableColumns } from "./SourcesTableColumns";
import { Source } from "./_FakeSourceData";
import { SourcesTableEmptyState } from "./SourcesTableEmptyState";
import { noop } from "#/common/utils";

const VALUE_NOT_AVAILABLE = "-";

export type SourcesTableProps = {
  sources?: Source[];
  onAddSources?: () => void;
};

export const SourcesTable: React.FC<SourcesTableProps> = (props) => {
  const { sources = [], onAddSources = noop } = props;
  const hasSources = sources.length > 0;

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
          </Tr>
        </Thead>
      )}
      <Tbody>
        {hasSources ? (
          sources.map((src) => (
            <Tr key={src.uuid}>
              <Td dataLabel={SourcesTableColumns.Name}>{src.name}</Td>
              <Td dataLabel={SourcesTableColumns.Status}>{src.status}</Td>
              <Td dataLabel={SourcesTableColumns.Hosts}>
                {src.hosts?.length ?? VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.VMs}>
                {src.vms?.length ?? VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.Networks}>
                {src.networks?.length ?? VALUE_NOT_AVAILABLE}
              </Td>
              <Td dataLabel={SourcesTableColumns.Datastores}>
                {src.datastores?.length ?? VALUE_NOT_AVAILABLE}
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={12}>
              <SourcesTableEmptyState onAddSources={onAddSources} />
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = "SourcesTable";
