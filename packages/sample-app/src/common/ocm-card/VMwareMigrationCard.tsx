import React from "react";
import {
  Card,
  CardHeader,
  Split,
  SplitItem,
  Label,
  CardBody,
  Title,
  Text,
  TextContent,
  CardFooter,
  Flex,
  FlexItem,
  Button,
} from "@patternfly/react-core";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";
import logo from "./assets/openshift-logo.svg";

const classes = {
  cardRoot: css({ width: "22em", height: "22em" }),
};

export const VMwareMigrationCard: React.FC = () => {
  return (
    <Card className={classes.cardRoot}>
      <CardHeader>
        <Split hasGutter>
          <SplitItem>
            <img src={logo} />
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Label color="blue">Self-managed service</Label>
          </SplitItem>
        </Split>
      </CardHeader>
      <CardBody>
        <Title headingLevel="h2">VMware to OpenShift migration</Title>
      </CardBody>
      <CardBody>
        <TextContent>
          <Text>
            Start your migration journey to OpenShift Virtualization. We will
            create a migration assessment report and help you create a migration
            plan.
          </Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <Flex>
          <FlexItem>
            <Link to="/migrate">
              <Button variant="secondary">Start your migration journey</Button>
            </Link>
          </FlexItem>
        </Flex>
      </CardFooter>
    </Card>
  );
};

VMwareMigrationCard.displayName = "VMwareMigrationCard";
