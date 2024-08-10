import React from "react";
import { css, keyframes } from "@emotion/css";
import {
  Bullseye,
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateActions,
  EmptyStateFooter,
  TextContent,
  Text,
  ButtonProps,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";
import globalWarningColor100 from "@patternfly/react-tokens/dist/esm/global_warning_color_100";

const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`;

const classes = {
  icon: css({
    fontSize: "6rem",
    animation: `${bounce} 1s ease infinite`,
    transformOrigin: "center bottom",
  }),
} as const;

type Props = {
  code: number | string;
  message: string;
  additionalDetails?: string;
  /** A list of actions, the first entry is considered primary and the rest are secondary. */
  actions: Array<Omit<ButtonProps, "variant">>;
};

export const ErrorPage: React.FC<Props> = (props) => {
  const { code, message, additionalDetails, actions } = props;
  const [primaryAction, ...otherActions] = actions;

  return (
    <Bullseye>
      <EmptyState variant="xl">
        <EmptyStateHeader
          titleText={code}
          headingLevel="h4"
          icon={
            <EmptyStateIcon
              className={classes.icon}
              icon={WarningTriangleIcon}
              color={globalWarningColor100.value}
            />
          }
        />
        <EmptyStateBody>
          <TextContent>
            <Text>{message}</Text>
            {additionalDetails ?? <Text>{additionalDetails}</Text>}
          </TextContent>
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button variant="primary" {...primaryAction} />
          </EmptyStateActions>
          <EmptyStateActions>
            {otherActions.map(({ key, ...props }) => (
              <Button key={key} variant="secondary" {...props} />
            ))}
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

ErrorPage.displayName = "ErrorPage";
