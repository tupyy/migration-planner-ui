import React from "react";
import Humanize from "humanize-plus";
import {
  Stack,
  StackItem,
  Icon,
  Text,
  TextContent,
} from "@patternfly/react-core";
import {
  CogsIcon,
  DatabaseIcon,
  HddIcon,
  InfrastructureIcon,
  NetworkIcon,
  ResourcesFullIcon,
  VirtualMachineIcon,
} from "@patternfly/react-icons";
import { Table, Tbody, Td, Tr } from "@patternfly/react-table";
import { type Source } from "@migration-planner-ui/api-client/models";
import globalSuccessColor100 from "@patternfly/react-tokens/dist/esm/global_success_color_100";
import globalWarningColor100 from "@patternfly/react-tokens/dist/esm/global_warning_color_100";
import { useDiscoverySources } from "#/migration-wizard/contexts/discovery-sources/Context";

export const DiscoveryStep: React.FC = () => {
  const discoverSourcesContext = useDiscoverySources();
  const [firstSource, ..._otherSources] = discoverSourcesContext.sources;
  const { inventory } = firstSource as Source;
  const { infra, vms } = inventory!;
  const { cpuCores, ramGB, diskCount, diskGB, os } = vms;
  const { datastores, networks } = infra;
  const totalDistributedSwitches = networks.filter(
    (net) => net.type === "distributed"
  ).length;
  const operatingSystems = Object.entries(os);

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Discovery report</Text>
          <Text component="p">
            Presenting the information we were able to fetch from the discovery
            process
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <VirtualMachineIcon />
            </Icon>
            Infrastructure
          </Text>
          <Text>
            We found {infra.totalClusters} ESXI clusters and {infra.totalHosts}{" "}
            hosts. The hosts have {cpuCores.total} CPU cores and{" "}
            {Humanize.fileSize(ramGB.total * 1024 ** 3, 0)} of RAM memory in
            total.
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <InfrastructureIcon />
            </Icon>
            Virtual machines
          </Text>
          <Text>
            This environment consists of {vms.total} virtual machines,{" "}
            {vms.totalMigratable} of them are potentially migratable to a new
            OpenShift cluster.
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <NetworkIcon />
            </Icon>
            Networks
          </Text>
          <Text>
            We found {networks.length} networks. {totalDistributedSwitches} of
            them are connected to a distibuted switch.
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <DatabaseIcon />
            </Icon>
            Storage
          </Text>
          <Text>
            The environment consists of {datastores.length} datastores with a
            total capacity of{" "}
            {Humanize.fileSize(
              datastores
                .map((ds) => ds.totalCapacityGB)
                .reduce((sum, next) => sum + next, 0) *
                1024 ** 3
            )}
            .
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <HddIcon />
            </Icon>
            Disks sizes
          </Text>
          <Text>
            The size of the VM disk affects the time to copy the VMDK file to
            the cluster and the time it takes to convert the disk.
            <br /> See our assessment by disk size.
          </Text>
          <Table
            variant="compact"
            borders={false}
            style={{ maxWidth: "20rem" }}
          >
            <Tbody>
              <Tr>
                <Td width={30}>1-2 TB</Td>
                <Td width={30}>3000 disks</Td>
                <Td width={40}>
                  <TextContent>
                    <Text>
                      <Icon
                        style={{
                          marginRight: "0.5rem",
                          color: globalSuccessColor100.value,
                        }}
                      >
                        <ResourcesFullIcon />
                      </Icon>
                      Easy
                    </Text>
                  </TextContent>
                </Td>
              </Tr>

              <Tr>
                <Td width={30}>3-9 TB</Td>
                <Td width={30}>865 disks</Td>
                <Td width={40}>
                  <TextContent>
                    <Text>
                      <Icon
                        style={{
                          marginRight: "0.5rem",
                          color: globalWarningColor100.value,
                        }}
                      >
                        <ResourcesFullIcon />
                      </Icon>
                      Medium
                    </Text>
                  </TextContent>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent style={{ paddingBlock: "1rem" }}>
          <Text component="h5">
            <Icon isInline style={{ marginRight: "0.5rem" }}>
              <CogsIcon />
            </Icon>
            Operating systems
          </Text>
          <Text>
            Out of the {vms.total} eligible workloads from VMware, we first categorize
            the VMs into supported operating systems and version or not.
          </Text>
          <Table
            variant="compact"
            borders={false}
            style={{ maxWidth: "30rem" }}
          >
            <Tbody>
              {operatingSystems.map(([name, count]) => (
                <Tr key={name}>
                  <Td width={20}>{name}</Td>
                  <Td width={10}>{count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TextContent>
      </StackItem>
    </Stack>
  );
};

DiscoveryStep.displayName = "DiscoveryStep";
