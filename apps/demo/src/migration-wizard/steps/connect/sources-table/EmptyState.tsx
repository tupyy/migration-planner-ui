import React from "react";
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, SearchIcon } from "@patternfly/react-icons";
import globalDangerColor200 from "@patternfly/react-tokens/dist/esm/global_danger_color_200";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SourcesTableEmptyState {
  export type Props = {
    variant?: "loading" | "error";
    isCreateDiscoverySourceDisabled?: boolean;
    onCreateDiscoverySource?: React.MouseEventHandler<HTMLButtonElement>;
  };
}

export const SourcesTableEmptyState: React.FC<SourcesTableEmptyState.Props> = (
  props
) => {
  const {
    variant,
    onCreateDiscoverySource,
    isCreateDiscoverySourceDisabled = false,
  } = props;

  switch (variant) {
    case "loading":
      return (
        <EmptyState variant="sm">
          <EmptyStateHeader
            titleText="Loading"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={Spinner} />}
          />
          <EmptyStateBody>
            Looking for existing discovery sources...
          </EmptyStateBody>
        </EmptyState>
      );
    case "error":
      return (
        <EmptyState variant="sm">
          <EmptyStateHeader
            titleText="Something went wrong..."
            headingLevel="h4"
            icon={
              <EmptyStateIcon
                icon={ExclamationCircleIcon}
                color={globalDangerColor200.value}
              />
            }
          />
          <EmptyStateBody>
            An error occurred while attempting to discover existing discovery
            sources
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="link" onClick={onCreateDiscoverySource}>
                Try again
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
    default:
      return (
        <EmptyState variant="sm">
          <EmptyStateHeader
            titleText="No discovery sources found"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={SearchIcon} />}
          />
          <EmptyStateBody>
            Begin by creating a discovery source. Then download and import the
            OVA file into your VMware environment.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                variant="secondary"
                onClick={onCreateDiscoverySource}
                isDisabled={isCreateDiscoverySourceDisabled}
              >
                Create
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
  }
};

SourcesTableEmptyState.displayName = "SourcesTableEmptyState";
