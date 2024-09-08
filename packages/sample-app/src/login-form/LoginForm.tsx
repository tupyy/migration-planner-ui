import React from "react";
import {
  Alert,
  AlertActionLink,
  ActionGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  List,
  ListItem,
  Text,
  TextContent,
  TextInput,
} from "@patternfly/react-core";
import { LoginFormViewModel } from "./types";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoginForm {
  export type Props = {
    vm: LoginFormViewModel;
  };
}

export const LoginForm: React.FC<LoginForm.Props> = (props) => {
  const { vm } = props;

  return (
    <Card
      style={{ width: "36rem" }}
      isFlat
      isRounded
      aria-labelledby="card-header-title"
      aria-describedby="card-body-description"
    >
      <CardHeader id="card-header-title">
        <TextContent>
          <Text component="h2">{vm.cardTitle}</Text>
          <Text>{vm.cardDescription}</Text>
        </TextContent>
      </CardHeader>

      <CardBody id="card-body-description">
        <Form
          ref={vm.formCallbackRef}
          onSubmit={vm.checkFormValidity}
          id="login-form"
        >
          <FormGroup label="URL" isRequired fieldId="url-form-control">
            <TextInput
              validated={vm.urlControlStateVariant}
              isDisabled={vm.shouldDisableFormControl}
              id="url-form-control"
              type="url"
              name="url"
              isRequired
              autoComplete="on"
              placeholder="https://vcenter_server_ip_address_or_fqdn"
              pattern="https://.*"
              aria-describedby="url-helper-text"
            />
            {vm.urlControlHelperText && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem
                    variant={vm.urlControlStateVariant}
                    id="url-helper-text"
                  >
                    {vm.urlControlHelperText}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup
            label="Username"
            isRequired
            fieldId="username-form-control"
          >
            <TextInput
              validated={vm.usernameControlStateVariant}
              isDisabled={vm.shouldDisableFormControl}
              id="username-form-control"
              type="email"
              name="username"
              isRequired
              autoComplete="username"
              placeholder="su.do@redhat.com"
              aria-describedby="username-helper-text"
            />
            {vm.usernameControlHelperText && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem
                    variant={vm.usernameControlStateVariant}
                    id="username-helper-text"
                  >
                    {vm.usernameControlHelperText}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup
            label="Password"
            isRequired
            fieldId="password-form-control"
          >
            <TextInput
              validated={vm.passwordControlStateVariant}
              isDisabled={vm.shouldDisableFormControl}
              id="password-form-control"
              type="password"
              name="password"
              isRequired
              autoComplete="current-password"
              aria-describedby="password-helper-text"
            />
            {vm.passwordControlHelperText && vm.passwordControlHelperText && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem
                    variant={vm.passwordControlStateVariant}
                    id="password-helper-text"
                  >
                    {vm.passwordControlHelperText}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>

          <FormGroup fieldId="checkbox-form-control">
            <Checkbox
              isDisabled={vm.shouldDisableFormControl}
              id="checkbox-form-control"
              name="isDataSharingAllowed"
              label={vm.isDataSharingAllowedCheckboxLabel}
              aria-label="Share aggregated data"
            />
          </FormGroup>
          {vm.shouldDisplayAlert && (
            <FormGroup>
              <Alert
                isInline
                variant={vm.alertVariant}
                title={vm.alertTitle}
                actionLinks={
                  <AlertActionLink component="a" href="#">
                    {vm.alertActionLinkText}
                  </AlertActionLink>
                }
              >
                {vm.alertDescriptionList &&
                  vm.alertDescriptionList.length > 0 && (
                    <List>
                      {vm.alertDescriptionList.map(({ id, text }) => (
                        <ListItem key={id}>{text}</ListItem>
                      ))}
                    </List>
                  )}
              </Alert>
            </FormGroup>
          )}
        </Form>
      </CardBody>
      <CardFooter>
        <ActionGroup>
          <Button
            type="submit"
            variant="primary"
            isDisabled={vm.shouldDisableFormControl}
            form="login-form"
          >
            Login
          </Button>
        </ActionGroup>
      </CardFooter>
    </Card>
  );
};

LoginForm.displayName = "LoginForm";
