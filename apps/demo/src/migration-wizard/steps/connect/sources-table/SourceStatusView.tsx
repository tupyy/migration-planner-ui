import React, { useMemo } from "react";
import type { Source } from "@migration-planner-ui/api-client/models";
import {
  Button,
  Icon,
  Popover,
  Spinner,
  Split,
  SplitItem,
  TextContent,
  Text,
} from "@patternfly/react-core";
import {
  DisconnectedIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import globalDangerColor200 from "@patternfly/react-tokens/dist/esm/global_danger_color_200";
import globalInfoColor100 from "@patternfly/react-tokens/dist/esm/global_info_color_100";
import globalSuccessColor100 from "@patternfly/react-tokens/dist/esm/global_success_color_100";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SourceStatusView {
  export type Props = {
    status: Source["status"];
    statusInfo?: Source["statusInfo"];
  };
}

export const SourceStatusView: React.FC<SourceStatusView.Props> = (props) => {
  const { status, statusInfo } = props;

  const statusView = useMemo(() => {
    // eslint-disable-next-line prefer-const
    let fake: Source['status'] | null = null;
    // fake = "not-connected";
    // fake = "waiting-for-credentials";
    // fake = "gathering-initial-inventory";
    // fake = "up-to-date";
    // fake = "error";
    switch (fake ?? status) {
      case "not-connected":
        return {
          icon: (
            <Icon isInline>
              <DisconnectedIcon />
            </Icon>
          ),
          text: "Not connected",
        };
      case "waiting-for-credentials":
        return {
          icon: (
            <Icon size="md" isInline>
              <InfoCircleIcon color={globalInfoColor100.value} />
            </Icon>
          ),
          text: "Waiting for credentials",
        };
      case "gathering-initial-inventory":
        return {
          icon: (
            <Icon size="md" isInline>
              <Spinner />
            </Icon>
          ),
          text: "Gathering inventory",
        };
      case "error":
        return {
          icon: (
            <Icon size="md" isInline>
              <ExclamationCircleIcon color={globalDangerColor200.value} />
            </Icon>
          ),
          text: "Error",
        };
      case "up-to-date":
        return {
          icon: (
            <Icon size="md" isInline>
              <CheckCircleIcon color={globalSuccessColor100.value} />
            </Icon>
          ),
          text: "Up to date",
        };
    }
  }, [status]);

  return (
    <Split hasGutter style={{ gap: "0.66rem" }}>
      <SplitItem>{statusView.icon}</SplitItem>
      <SplitItem>
        {statusInfo ? (
          <Popover
            aria-label={statusView.text}
            headerContent={statusView.text}
            headerComponent="h1"
            bodyContent={
              <TextContent>
                <Text>{statusInfo}</Text>
              </TextContent>
            }
          >
            <Button variant="link" isInline>
              {statusView.text}
            </Button>
          </Popover>
        ) : (
          statusView.text
        )}
      </SplitItem>
    </Split>
  );
};

SourceStatusView.displayName = "SourceStatusView";
