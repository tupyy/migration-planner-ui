import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { SourcesTableColumns } from "./SourcesTableColumns";
import { Source, fakeSources } from "./_FakeSourceData"; // TODO(jkilzi): replace with real Source data
import { SourcesTableEmptyState } from "./SourcesTableEmptyState";

export type SourcesTableProps = {
  sources?: Source[];
};

export const SourcesTable: React.FC<SourcesTableProps> = (props) => {
  const { sources = [] } = props;
  const hasSources = sources.length > 0;
  const handleAddSources = useCallback(() => {
    console.log("Adding sources...");
    sources.push(fakeSources[0])
  }, [sources]);

  return (
    <Table aria-label="Sources table" borders={false} style={{ height: 200 }}>
      <Thead>
        <Tr>
          <Th>{SourcesTableColumns.Name}</Th>
          <Th>{SourcesTableColumns.Status}</Th>
          <Th>{SourcesTableColumns.VmUrl}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {hasSources ? (
          sources.map((src) => (
            <Tr key={src.uuid}>
              <Td dataLabel={SourcesTableColumns.Name}>{src.name}</Td>
              <Td dataLabel={SourcesTableColumns.Status}>{src.status}</Td>
              <Td dataLabel={SourcesTableColumns.VmUrl}>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={src.vmUrl ?? "#"}
                >
                  {src.vmUrl}
                </Link>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={12}>
              <SourcesTableEmptyState
                onAddSources={handleAddSources}
              />
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = "SourcesTable";
