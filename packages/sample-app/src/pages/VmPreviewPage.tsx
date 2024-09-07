import React, { useCallback, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ActionGroup,
  Alert,
  AlertActionLink,
  Bullseye,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  List,
  ListItem,
  TextInput,
  Text,
  TextContent,
  Backdrop,
} from "@patternfly/react-core";
import { useMount, useTitle } from "react-use";
import { useLazyRef } from "#/kitchensink/useLazyRef";
import * as time from "#/kitchensink/time";
import { useNavigate } from "react-router-dom";

const docTitle = "Virtualization Migration";
const cardTitle = "Virtualization Migration Planner";
const cardDescription = `
The Migration Planner requires access to your VMware environment to execute a
comprehensive discovery process that gathers essential data, including
network topology, storage configuration, and virtual machine inventory. The
process leverages this information to provide tailored recommendations for a
seamless workload transition to OpenShift Virtualization.`.trim();
const urlControlHelperText = "";
const usernameControlHelperText = "";
const passwordControlHelperText = "";
const checkboxLabel =
  "I agree to share aggregated data about my environment with Red Hat.";
const isButtonDisabled = false;
const alertVariant = "success";
const alertTitle = "";
const alertDescriptionList: Array<{ id: number; text: string }> = [];
const alertActionLinkText = "";
const plannerApiUrl = "http://127.0.0.1:5173/api/credentials/1";
const isDataSharingAllowed = true;

const enum FormState {
  Initial = "initial",
  Submitting = "submitting",
  Accepted = "accepted",
  Rejected = "rejected",
  InvalidCredentials = "invalidCredentials",
}

type ValidationResult = "all" | "none" | "url";

const miniClient = {
  async putCredentials(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): Promise<[ValidationResult, null] | [null, Error]> {
    const abortController = new AbortController();
    const signal = abortController.signal;
    window.setTimeout(() => {
      abortController.abort("The server did not respond in a timely fashion.");
    }, 30 * time.Second);

    const response = await fetch(plannerApiUrl, {
      method: "PUT",
      signal,
      body: JSON.stringify(data),
    });

    if (response.ok || (400 <= response.status && response.status < 500)) {
      const body = (await response.json()) as ValidationResult;
      return [body, null];
    } else {
      const error = new Error(
        `Request 'PUT ${plannerApiUrl}' failed due to: ${response.statusText}`
      );
      error.name = String(response.status);
      return [null, error];
    }
  },
};

const getFormState = (result: ValidationResult): FormState => {
  switch (result) {
    case "none":
      return FormState.Rejected;
    case "url":
      return FormState.InvalidCredentials;
    case "all":
      return FormState.Accepted;
  }
};

export const VmPreviewPage: React.FC = () => {
  useTitle(docTitle);
  const [state, setState] = useState<FormState>(FormState.Initial);
  const [formRef, formCallbackRef] = useLazyRef<HTMLFormElement>(
    useCallback((node) => {
      node["isDataSharingAllowed"].checked = isDataSharingAllowed;
    }, [])
  );
  const eventTargetRef = useRef<EventTarget>(new EventTarget());
  const navigateTo = useNavigate();

  const handleSubmit = useCallback(async () => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const [url, username, password, isDataSharingAllowed] = Array.from(
      form.elements
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    ).map(({ value }) => value);
    const [fieldsValidation, error] = await miniClient.putCredentials({
      url,
      username,
      password,
      isDataSharingAllowed,
    });
    if (error != null) {
      navigateTo(`/error/${error.name}`, { state: { message: error.message } });
    }
    const formState = getFormState(fieldsValidation!);
    setState(formState);
  }, [state]);

  useMount(() => {
    const eventTarget = eventTargetRef.current;
    eventTarget.addEventListener("submit", handleSubmit);
    return (): void => {
      eventTarget.removeEventListener("submit", handleSubmit);
    };
  });

  const checkFormValidity = useCallback<
    React.FormEventHandler<HTMLFormElement>
  >((event): void => {
    event.preventDefault();
    const form = formRef.current;
    const ok = form?.reportValidity();
    if (ok) {
      setState(FormState.Submitting);
      eventTargetRef.current.dispatchEvent(new Event("submit"));
    }
  }, []);

  return (
    <>
      <Backdrop style={{ zIndex: 0 }} />
      <Bullseye>
        <Card
          style={{ width: "37rem" }}
          isFlat
          isRounded
          aria-labelledby="card-header-title"
          aria-describedby="card-body-description"
        >
          <CardHeader id="card-header-title">
            <TextContent>
              <Text component="h2">{cardTitle}</Text>
              <Text>{cardDescription}</Text>
            </TextContent>
          </CardHeader>

          <CardBody id="card-body-description">
            <Form
              ref={formCallbackRef}
              onSubmit={checkFormValidity}
              id="login-form"
            >
              <FormGroup label="URL" isRequired fieldId="url-form-control">
                <TextInput
                  validated={urlControlState}
                  isDisabled={state === FormState.Submitting}
                  readOnly={
                    state === FormState.Submitting ||
                    state === FormState.Accepted
                  }
                  id="url-form-control"
                  type="url"
                  name="url"
                  isRequired
                  autoComplete="on"
                  placeholder="https://vcenter_server_ip_address_or_fqdn"
                  pattern="https://.*"
                  aria-describedby="url-helper-text"
                />
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem variant={urlControlState} id="url-helper-text">
                      {urlControlHelperText}
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              <FormGroup
                label="Username"
                isRequired
                fieldId="username-form-control"
              >
                <TextInput
                  validated={usernameControlState}
                  isDisabled={state === FormState.Submitting}
                  readOnly={
                    state === FormState.Submitting ||
                    state === FormState.Accepted
                  }
                  id="username-form-control"
                  type="email"
                  name="username"
                  isRequired
                  autoComplete="username"
                  placeholder="su.do@redhat.com"
                  aria-describedby="username-helper-text"
                />
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem variant={usernameControlState} id="username-helper-text">
                      {usernameControlHelperText}
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </FormGroup>

              <FormGroup
                label="Password"
                isRequired
                fieldId="password-form-control"
              >
                <TextInput
                  validated={passwordControlState}
                  isDisabled={state === FormState.Submitting}
                  readOnly={
                    state === FormState.Submitting ||
                    state === FormState.Accepted
                  }
                  id="password-form-control"
                  type="password"
                  name="password"
                  isRequired
                  autoComplete="current-password"
                  aria-describedby="password-helper-text"
                />
                {passwordControlHelperText.length > 0 && (
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem variant={passwordControlState} id="password-helper-text">
                        {passwordControlHelperText}
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                )}
              </FormGroup>

              <FormGroup fieldId="checkbox-form-control">
                <Checkbox
                  isDisabled={state === FormState.Submitting}
                  readOnly={
                    state === FormState.Submitting ||
                    state === FormState.Accepted
                  }
                  id="checkbox-form-control"
                  name="isDataSharingAllowed"
                  label={checkboxLabel}
                  aria-label="Share aggregated data"
                />
              </FormGroup>
              {![FormState.Initial, FormState.Submitting].includes(state) && (
                <FormGroup>
                  <Alert
                    isInline
                    variant={alertVariant}
                    title={alertTitle}
                    actionLinks={
                      <AlertActionLink component="a" href="#">
                        {alertActionLinkText}
                      </AlertActionLink>
                    }
                  >
                    {alertDescriptionList.length > 0 && (
                      <List>
                        {alertDescriptionList.map(({ id, text }) => (
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
                isDisabled={isButtonDisabled}
                form="login-form"
              >
                Login
              </Button>
            </ActionGroup>
          </CardFooter>
        </Card>
      </Bullseye>
    </>
  );
};

VmPreviewPage.displayName = "VmPreviewPage";
