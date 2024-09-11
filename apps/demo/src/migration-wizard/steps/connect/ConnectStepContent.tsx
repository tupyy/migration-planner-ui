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
} from "@patternfly/react-core";
import { SourcesTable } from "./sources-table/SourcesTable";
import { ClusterIcon } from "@patternfly/react-icons";
import { ConnectStepViewModelInterface } from "./ViewModel";

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
export namespace ConnectStepContent {
  export type Props = { vm: ConnectStepViewModelInterface };
}

export const ConnectStepContent: React.FC<ConnectStepContent.Props> = (
  props
) => {
  const { vm } = props;

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Connect your VMware environment</Text>
        </TextContent>
      </StackItem>
      <StackItem>{vm.sources?.length > 0 && <InstructionsList />}</StackItem>
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
            <SourcesTable
              sources={vm.sources ?? []}
              onAddSources={vm.handleAddSources}
            />
          </PanelMain>
        </Panel>
      </StackItem>
    </Stack>
  );
};

ConnectStepContent.displayName = "ConnectStepContent";
