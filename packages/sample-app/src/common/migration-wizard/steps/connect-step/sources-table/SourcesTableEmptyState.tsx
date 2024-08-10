import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Button,
} from "@patternfly/react-core";
import { ClusterIcon } from "@patternfly/react-icons";
import React from "react";

type SourcesTableEmptyState = {
  onAddSources(): void;
};

export const SourcesTableEmptyState: React.FC<SourcesTableEmptyState> = (
  props
) => {
  const { onAddSources } = props;
  return (
    <EmptyState variant="sm">
      <EmptyStateHeader
        titleText="No sources found"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={ClusterIcon} />}
      />
      <EmptyStateBody>
        We did not detect any connected sources. Please add a new migration
        source.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button onClick={onAddSources}>Add sources</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

SourcesTableEmptyState.displayName = "SourcesTableEmptyState";
