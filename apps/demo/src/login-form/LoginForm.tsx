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

export const LoginForm: React.FC<LoginFormViewModel> = (props) => (
  <Card
    style={{ width: "36rem" }}
    isFlat
    isRounded
    aria-labelledby="card-header-title"
    aria-describedby="card-body-description"
  >
    <CardHeader id="card-header-title">
      <TextContent>
        <Text component="h2">{props.cardTitle}</Text>
        <Text>{props.cardDescription}</Text>
      </TextContent>
    </CardHeader>

    <CardBody id="card-body-description">
      <Form
        ref={props.formRef}
        onSubmit={props.checkFormValidity}
        id="login-form"
      >
        <FormGroup label="URL" isRequired fieldId="url-form-control">
          <TextInput
            validated={props.urlControlStateVariant}
            isDisabled={props.shouldDisableFormControl}
            id="url-form-control"
            type="url"
            name="url"
            isRequired
            autoComplete="on"
            placeholder="https://vcenter_server_ip_address_or_fqdn"
            pattern="https://.*"
            aria-describedby="url-helper-text"
          />
          {props.urlControlHelperText && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  variant={props.urlControlStateVariant}
                  id="url-helper-text"
                >
                  {props.urlControlHelperText}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>

        <FormGroup label="Username" isRequired fieldId="username-form-control">
          <TextInput
            validated={props.usernameControlStateVariant}
            isDisabled={props.shouldDisableFormControl}
            id="username-form-control"
            type="email"
            name="username"
            isRequired
            autoComplete="username"
            placeholder="su.do@redhat.com"
            aria-describedby="username-helper-text"
          />
          {props.usernameControlHelperText && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  variant={props.usernameControlStateVariant}
                  id="username-helper-text"
                >
                  {props.usernameControlHelperText}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>

        <FormGroup label="Password" isRequired fieldId="password-form-control">
          <TextInput
            validated={props.passwordControlStateVariant}
            isDisabled={props.shouldDisableFormControl}
            id="password-form-control"
            type="password"
            name="password"
            isRequired
            autoComplete="current-password"
            aria-describedby="password-helper-text"
          />
          {props.passwordControlHelperText &&
            props.passwordControlHelperText && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem
                    variant={props.passwordControlStateVariant}
                    id="password-helper-text"
                  >
                    {props.passwordControlHelperText}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
        </FormGroup>

        <FormGroup fieldId="checkbox-form-control">
          <Checkbox
            isDisabled={props.shouldDisableFormControl}
            id="checkbox-form-control"
            name="isDataSharingAllowed"
            label={props.isDataSharingAllowedCheckboxLabel}
            aria-label="Share aggregated data"
          />
        </FormGroup>
        {props.shouldDisplayAlert && (
          <FormGroup>
            <Alert
              isInline
              variant={props.alertVariant}
              title={props.alertTitle}
              actionLinks={
                <AlertActionLink component="a" href="#">
                  {props.alertActionLinkText}
                </AlertActionLink>
              }
            >
              {props.alertDescriptionList &&
                props.alertDescriptionList.length > 0 && (
                  <List>
                    {props.alertDescriptionList.map(({ id, text }) => (
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
          isDisabled={props.shouldDisableFormControl}
          form="login-form"
        >
          Login
        </Button>
      </ActionGroup>
    </CardFooter>
  </Card>
);

LoginForm.displayName = "LoginForm";
