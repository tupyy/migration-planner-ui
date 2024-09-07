import React from "react";
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@patternfly/react-core";
import { DisconnectedIcon } from "@patternfly/react-icons";

type SourcesTableEmptyStateProps = {
  onAddSources(): void;
};

export const SourcesTableEmptyState: React.FC<SourcesTableEmptyStateProps> = (
  props
) => {
  const { onAddSources } = props;

  return (
    <EmptyState variant="xs">
      <EmptyStateHeader
        titleText="No environment detected"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={DisconnectedIcon} />}
      />
      <EmptyStateBody>
        Import the OVA file to establish a discovery source within your VMware
        environment.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="secondary" onClick={onAddSources}>
            Download OVA file
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

SourcesTableEmptyState.displayName = "SourcesTableEmptyState";
