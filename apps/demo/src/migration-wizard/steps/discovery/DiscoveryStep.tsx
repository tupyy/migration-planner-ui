import React from "react";
import Humanize from "humanize-plus";
import {
  Stack,
  StackItem,
  Icon,
  Text,
  TextContent,
  TreeView,
  TreeViewDataItem,
  Badge,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import {
  CogsIcon,
  DatabaseIcon,
  DataProcessorIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  HddIcon,
  InfrastructureIcon,
  MicrochipIcon,
  NetworkIcon,
  VirtualMachineIcon,
} from "@patternfly/react-icons";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import globalWarningColor100 from "@patternfly/react-tokens/dist/esm/global_warning_color_100";
import globalDangerColor100 from "@patternfly/react-tokens/dist/esm/global_danger_color_100";
import { type Source } from "@migration-planner-ui/api-client/models";
import { useDiscoverySources } from "#/migration-wizard/contexts/discovery-sources/Context";
import {
  Chart,
  ChartVoronoiContainer,
  ChartAxis,
  ChartGroup,
  ChartBar,
} from "@patternfly/react-charts";

type Histogram = {
  data: number[];
  minValue: number;
  step: number;
};

type ChartBarDataEntry = {
  name: string;
  x: string;
  y: number;
};

function histogramToBarChartData(
  histogram: Histogram,
  name: string
): ChartBarDataEntry[] {
  const { minValue, step, data } = histogram;
  return data.map((y, idx) => {
    const lo = step * idx + minValue;
    const hi = lo + step - 1;

    return {
      name,
      x: `${lo}-${hi}`,
      y,
    };
  });
}

function getMax(histogram: Histogram): number {
  const [head, ..._] = histogram.data;
  return histogram.data.reduce((prev, next) => Math.max(prev, next), head);
}

export const DiscoveryStep: React.FC = () => {
  const discoverSourcesContext = useDiscoverySources();
  const [firstSource, ..._otherSources] = discoverSourcesContext.sources;
  const { inventory } = firstSource as Source;
  const { infra, vms } = inventory!;
  const {
    datastores,
    networks,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    vlans,
  } = infra;
  const { cpuCores, ramGB, diskCount, diskGB, os } = vms;
  const totalDistributedSwitches = networks.filter(
    (net) => net.type === "distributed"
  ).length;
  const operatingSystems = Object.entries(os);

  const infrastructureViewData: TreeViewDataItem = {
    title: "Infrastructure",
    icon: <InfrastructureIcon />,
    name: (
      <>
        We found {infra.totalClusters}{" "}
        {Humanize.pluralize(infra.totalClusters, "cluster")} with{" "}
        {infra.totalHosts} {Humanize.pluralize(infra.totalHosts, "host")}. The
        hosts have a total of {cpuCores.total} CPU cores and{" "}
        {Humanize.fileSize(ramGB.total * 1024 ** 3, 0)} of memory.
      </>
    ),
    id: "infra",
  };

  const computeStatsViewData: TreeViewDataItem = {
    title: "Compute",
    icon: <MicrochipIcon />,
    id: "compute",
    name: (
      <Flex
        fullWidth={{ default: "fullWidth" }}
        spaceItems={{ default: "spaceItemsXl" }}
      >
        <FlexItem>
          <TextContent style={{ textAlign: "center" }}>
            <Text>CPU Cores</Text>
          </TextContent>
          <Chart
            name="cpuCores"
            ariaDesc="CPU cores distribution"
            ariaTitle="CPU cores distribution"
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) => `${datum.name}: ${datum.y}`}
                constrainToVisibleArea
              />
            }
            domain={{
              y: [0, getMax(vms.cpuCores.histogram)],
            }}
            domainPadding={{ x: [10, 10] }}
            legendOrientation="horizontal"
            legendPosition="bottom-left"
            padding={50}
            width={400}
            height={250}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartGroup>
              <ChartBar
                data={histogramToBarChartData(vms.cpuCores.histogram, "Cores")}
              />
            </ChartGroup>
          </Chart>
        </FlexItem>
        <FlexItem>
          <TextContent style={{ textAlign: "center" }}>
            <Text>Memory</Text>
          </TextContent>
          <Chart
            name="memory"
            ariaDesc="Memory distribution"
            ariaTitle="Memory distribution"
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) => `${datum.name}: ${datum.y}`}
                constrainToVisibleArea
              />
            }
            domain={{ y: [0, getMax(vms.ramGB.histogram)] }}
            domainPadding={{ x: [10, 10] }}
            legendOrientation="horizontal"
            legendPosition="bottom-left"
            padding={50}
            width={400}
            height={250}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartGroup>
              <ChartBar
                data={histogramToBarChartData(vms.ramGB.histogram, "RAM")}
              />
            </ChartGroup>
          </Chart>
        </FlexItem>
      </Flex>
    ),
  };

  const diskStatsViewData: TreeViewDataItem = {
    title: "Disk size",
    icon: <HddIcon />,
    name: (
      <>
        The size of the virtual machine disk (VMDK) impacts the migration
        process duration due to the time required to copy the file to the
        OpenShift cluster and the time needed for disk format conversion.
      </>
    ),
    id: "disk-size",
    children: [
      {
        title: "Details",
        id: "infra-details",
        name: (
          <Flex
            fullWidth={{ default: "fullWidth" }}
            spaceItems={{ default: "spaceItemsXl" }}
          >
            <FlexItem>
              <TextContent style={{ textAlign: "center" }}>
                <Text>Disk capacity in GB</Text>
              </TextContent>
              <Chart
                name="diskCapacityGB"
                ariaDesc="Disk capacity distribution in GB"
                ariaTitle="Disk capacity distribution in GB"
                containerComponent={
                  <ChartVoronoiContainer
                    labels={({ datum }) => `${datum.name}: ${datum.y}`}
                    constrainToVisibleArea
                  />
                }
                domain={{
                  y: [0, getMax(vms.diskGB.histogram)],
                }}
                domainPadding={{ x: [10, 10] }}
                legendOrientation="horizontal"
                legendPosition="bottom-left"
                padding={50}
                width={400}
                height={250}
              >
                <ChartAxis />
                <ChartAxis dependentAxis showGrid />
                <ChartGroup>
                  <ChartBar
                    data={histogramToBarChartData(
                      vms.diskGB.histogram,
                      "Capacity in GB"
                    )}
                  />
                </ChartGroup>
              </Chart>
            </FlexItem>
            <FlexItem>
              <TextContent style={{ textAlign: "center" }}>
                <Text>Disk count</Text>
              </TextContent>
              <Chart
                name="diskCount"
                ariaDesc="Disk count distribution"
                ariaTitle="Disk count distribution"
                containerComponent={
                  <ChartVoronoiContainer
                    labels={({ datum }) => `${datum.name}: ${datum.y}`}
                    constrainToVisibleArea
                  />
                }
                domain={{ y: [0, getMax(vms.diskCount.histogram)] }}
                domainPadding={{ x: [10, 10] }}
                legendOrientation="horizontal"
                legendPosition="bottom-left"
                padding={50}
                width={400}
                height={250}
              >
                <ChartAxis />
                <ChartAxis dependentAxis showGrid />
                <ChartGroup>
                  <ChartBar
                    data={histogramToBarChartData(
                      vms.diskCount.histogram,
                      "Count"
                    )}
                  />
                </ChartGroup>
              </Chart>
            </FlexItem>
          </Flex>
        ),
      },
    ],
  };

  const virtualMachinesViewData: TreeViewDataItem = {
    title: "Virtual machines",
    icon: <VirtualMachineIcon />,
    name: (
      <>
        This environment consists of {vms.total} virtual machines,{" "}
        {vms.totalMigratableWithWarnings ?? 0} of them are potentially
        migratable to a new OpenShift cluster.
      </>
    ),
    id: "vms",
    children: [
      {
        name: (
          <TextContent>
            <Text>
              Warnings{" "}
              <Badge isRead>
                {vms.migrationWarnings
                  .map(({ count }) => count)
                  .reduce((sum, n) => sum + n, 0)}
              </Badge>
            </Text>
          </TextContent>
        ),
        icon: (
          <Icon style={{ color: globalWarningColor100.value }}>
            <ExclamationTriangleIcon />
          </Icon>
        ),
        id: "migration-warnings",
        children: [
          {
            name: (
              <Table
                variant="compact"
                borders={true}
                style={{ border: "1px solid lightgray", borderRight: "none" }}
              >
                <Thead>
                  <Tr>
                    <Th hasRightBorder>Total</Th>
                    <Th hasRightBorder>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {vms.migrationWarnings.map((e) => (
                    <Tr key={e.label}>
                      <Td hasRightBorder>{e.count}</Td>
                      <Td hasRightBorder>{e.assessment}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ),
            id: "migration-warnings-details",
          },
        ],
      },
      vms.notMigratableReasons.length > 0
        ? {
            name: (
              <TextContent>
                <Text>
                  Not migratable reasons{" "}
                  <Badge isRead>
                    {vms.migrationWarnings
                      .map(({ count }) => count)
                      .reduce((sum, n) => sum + n, 0)}
                  </Badge>
                </Text>
              </TextContent>
            ),
            icon: (
              <Icon style={{ color: globalDangerColor100.value }}>
                <ExclamationCircleIcon />
              </Icon>
            ),
            id: "not-migratable",
            children: [
              {
                name: (
                  <Table
                    variant="compact"
                    borders={true}
                    style={{
                      border: "1px solid lightgray",
                      borderRight: "none",
                    }}
                  >
                    <Thead>
                      <Tr>
                        <Th hasRightBorder>Total</Th>
                        <Th hasRightBorder>Description</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {vms.notMigratableReasons.map((e) => (
                        <Tr key={e.label}>
                          <Td hasRightBorder>{e.count}</Td>
                          <Td hasRightBorder>{e.assessment}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ),
                id: "not-migratable-details",
              },
            ],
          }
        : null,
      computeStatsViewData,
      diskStatsViewData,
    ].filter(Boolean) as TreeViewDataItem[],
  };

  const networksViewData: TreeViewDataItem = {
    title: "Networks",
    icon: <NetworkIcon />,
    name: (
      <>
        We found {networks.length} networks. {totalDistributedSwitches} of them
        are connected to a distibuted switch.
      </>
    ),
    id: "networks",
    children: [
      {
        title: "Details",
        name: (
          <Table
            variant="compact"
            borders={true}
            style={{ border: "1px solid lightgray", borderRight: "none" }}
          >
            <Thead>
              <Tr>
                <Th hasRightBorder>Name</Th>
                <Th hasRightBorder>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {networks.map((net) => (
                <Tr key={net.name}>
                  <Td hasRightBorder>{net.name}</Td>
                  <Td hasRightBorder>{net.type}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ),
        id: "networks-details",
      },
      {
        title: "VLANs",
        name: (
          <Table
            variant="compact"
            borders={true}
            style={{ border: "1px solid lightgray", borderRight: "none" }}
          >
            <Tbody>
              <Tr>
                {((vlans as string[]) ?? []).sort().map((vlan) => (
                  <Td hasRightBorder key={vlan}>
                    {vlan}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        ),
        id: "vlans",
      },
    ],
  };

  const storageViewData: TreeViewDataItem = {
    title: "Storage",
    icon: <DatabaseIcon />,
    name: (
      <>
        The environment consists of {datastores.length} datastores with a total
        capacity of{" "}
        {Humanize.fileSize(
          datastores
            .map((ds) => ds.totalCapacityGB)
            .reduce((sum, next) => sum + next, 0) *
            1024 ** 3
        )}
        .
      </>
    ),
    id: "storage",
    children: [
      {
        title: "Datastores",
        name: (
          <Table
            variant="compact"
            borders={true}
            style={{ border: "1px solid lightgray", borderRight: "none" }}
          >
            <Thead>
              <Tr>
                <Th hasRightBorder>Total</Th>
                <Th hasRightBorder>Free</Th>
                <Th hasRightBorder>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {datastores.map(
                (ds, idx /* TODO(jkilzi): Request to send IDs!!! */) => (
                  <Tr key={idx}>
                    <Td hasRightBorder>{ds.totalCapacityGB}</Td>
                    <Td hasRightBorder>{ds.freeCapacityGB}</Td>
                    <Td hasRightBorder>{ds.type}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        ),
        id: "datastores",
      },
    ],
  };

  const operatingSystemsViewData: TreeViewDataItem = {
    title: "Operating systems",
    icon: <CogsIcon />,
    name: (
      <>These are the operating systems running on your virtual machines.</>
    ),
    id: "os",
    children: [
      {
        title: "Details",
        name: (
          <Table
            variant="compact"
            borders={true}
            style={{
              border: "1px solid lightgray",
              borderRight: "none",
              width: "25rem",
            }}
          >
            <Thead>
              <Tr>
                <Th hasRightBorder>Count</Th>
                <Th hasRightBorder>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {operatingSystems.map(([name, count]) => (
                <Tr key={name}>
                  <Td hasRightBorder>{count}</Td>
                  <Td hasRightBorder>{name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ),
        id: "os-details",
      },
    ],
  };

  const treeViewData: Array<TreeViewDataItem> = [
    infrastructureViewData,
    virtualMachinesViewData,
    networksViewData,
    storageViewData,
    operatingSystemsViewData,
  ];

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Discovery report</Text>
          <Text component="p">
            Review the information collected during the discovery process
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TreeView
          aria-label="Discovery report"
          variant="compactNoBackground"
          data={treeViewData}
        />
      </StackItem>
    </Stack>
  );
};

DiscoveryStep.displayName = "DiscoveryStep";
