import {
  Stack,
  StackItem,
  TextContent,
  Text,
  Panel,
  PanelMain,
  PanelMainBody,
  PanelHeader,
} from "@patternfly/react-core";
import React from "react";
import { SourcesTable } from "./sources-table/SourcesTable";

export const ConnectStepContent: React.FC = () => {
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Add source</Text>
          <Text component="p">Lets connect to your VMware environment</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Panel variant="bordered">
          <PanelMain>
            <PanelHeader>
              <TextContent>
                <Text component="h3">Source</Text>
                <Text component="small">
                  Select the vCenter you wish to migrate
                </Text>
              </TextContent>
            </PanelHeader>
            <PanelMainBody>
              <SourcesTable />
            </PanelMainBody>
          </PanelMain>
        </Panel>
      </StackItem>
    </Stack>
  );
};

ConnectStepContent.displayName = "ConnectStepContent";
