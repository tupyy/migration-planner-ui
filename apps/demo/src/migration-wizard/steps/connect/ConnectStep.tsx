import React from "react";
import {
  Stack,
  StackItem,
  TextContent,
  Text,
  Panel,
  PanelMain,
  PanelHeader,
  List,
  OrderType,
  ListItem,
  Icon,
  Alert,
  AlertActionLink,
} from "@patternfly/react-core";
import { ClusterIcon } from "@patternfly/react-icons";
import { type Source } from "@migration-planner-ui/api-client/models";
import { type AsyncStateRetry } from "react-use/lib/useAsyncRetry";
import { SourcesTable } from "./sources-table/SourcesTable";

const InstructionsList: React.FC = () => (
  <TextContent style={{ paddingBlock: "1rem" }}>
    <Text component="h4">
      Follow these steps to connect your environment and start the discovery
      process
    </Text>
    <List
      component="ol"
      type={OrderType.number}
      style={{ marginInlineStart: 0 }}
    >
      <ListItem>
        A link will appear below once the VM is running. Use this link to enter
        credentials and connect your environment.
      </ListItem>
      <ListItem>
        When the connection is established, you will be able to proceed and see
        the discovery report.
      </ListItem>
    </List>
  </TextContent>
);

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ConnectStep {
  export type Props = {
    sources: Readonly<AsyncStateRetry<Source[]>>;
  };
}

export const ConnectStep: React.FC<ConnectStep.Props> = (props) => {
  const { sources } = props;
  const hasSources = (sources.value ?? []).length > 0;

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Connect your VMware environment</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <InstructionsList />
        {hasSources && (
          <Alert
            isInline
            variant="custom"
            title="Discovery VM"
            actionLinks={
              <AlertActionLink
                component="a"
                href="http://127.0.0.1:5173/preview/vm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {sources.value![0].credentialUrl}
              </AlertActionLink>
            }
          >
            <TextContent>
              <Text>
                Click the link below to connect the Discovery Source to your
                VMware environment.
              </Text>
            </TextContent>
          </Alert>
        )}
      </StackItem>
      <StackItem>
        <Panel variant="bordered">
          <PanelMain>
            <PanelHeader style={{ paddingBlockEnd: 0 }}>
              <TextContent>
                <Text component="h3">
                  <Icon isInline style={{ marginRight: "1rem" }}>
                    <ClusterIcon />
                  </Icon>
                  Environment
                </Text>
              </TextContent>
            </PanelHeader>
            <SourcesTable sources={sources} />
          </PanelMain>
        </Panel>
      </StackItem>
    </Stack>
  );
};

ConnectStep.displayName = "ConnectStep";
