import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useMount, useTitle } from "react-use";
import { useNavigate } from "react-router-dom";
import { useInjection } from "inversify-react";
import { AlertVariant } from "@patternfly/react-core";
import type { Credentials } from "#/services/agent-api/models";
import type { CredentialsApiInterface } from "#/services/agent-api/apis/CredentialsApi";
import {
  cardTitle,
  cardDescription,
  docTitle,
  isDataSharingAllowedCheckboxLabel,
  DATA_SHARING_ALLOWED_DEFAULT_STATE,
  REQUEST_TIMEOUT_SECONDS,
} from "./Constants";
import { serviceIdentifiers } from "#/main/IoC";
import { newAbortSignal } from "#/common/AbortSignal";
import { FormStates } from "./FormStates";
import { FormControlValidatedStateVariant } from "./Aliases";

export interface LoginFormViewModelInterface {
  formState: FormStates;
  formRef: React.MutableRefObject<HTMLFormElement | undefined>;
  cardTitle: string;
  cardDescription: string;
  urlControlStateVariant: FormControlValidatedStateVariant;
  urlControlHelperText?: string;
  usernameControlStateVariant: FormControlValidatedStateVariant;
  usernameControlHelperText?: string;
  passwordControlStateVariant: FormControlValidatedStateVariant;
  passwordControlHelperText?: string;
  shouldDisableFormControl: boolean;
  isDataSharingAllowedCheckboxLabel: string;
  alertVariant?: AlertVariant;
  alertTitle?: string;
  alertDescriptionList?: Array<{ id: number; text: string }>;
  alertActionLinkText?: string;
  shouldDisplayAlert: boolean;
  checkFormValidity: React.FormEventHandler<HTMLFormElement>;
}

const _computeFormControlVariant = (
  formState: FormStates
): FormControlValidatedStateVariant => {
  switch (formState) {
    case FormStates.Accepted:
      return "success";
    case FormStates.InvalidCredentials:
    case FormStates.Rejected:
      return "error";
    default:
      return "default";
  }
};

export const useViewModel = (): LoginFormViewModelInterface => {
  const [formState, setFormState] = useState<FormStates>(FormStates.Initial);
  const formRef = useRef<HTMLFormElement>();
  const eventTargetRef = useRef<EventTarget>(new EventTarget());
  const navigateTo = useNavigate();
  const credentialsApiClient = useInjection<CredentialsApiInterface>(
    serviceIdentifiers.CredentialsApi
  );

  const handleSubmit = useCallback(async () => {
    const form = formRef.current;
    if (!form) {
      console.log("The form is not mounted yet");
      return;
    }

    const credentials: Credentials = {
      url: form["url"].value,
      username: form["username"].value,
      password: form["password"].value,
      isDataSharingAllowed: form["isDataSharingAllowed"].checked,
    };
    const signal = newAbortSignal(
      REQUEST_TIMEOUT_SECONDS,
      "The server didn't respond in a timely fashion."
    );
    const [statusCodeOK, error] = await credentialsApiClient.putCredentials(
      credentials,
      {
        signal,
        pathParams: ["/204"],
      }
    );

    const status = statusCodeOK ?? error.code;
    switch (status) {
      case 204:
        setFormState(FormStates.Accepted);
        break;
      case 400:
        setFormState(FormStates.Rejected);
        break;
      case 401:
        setFormState(FormStates.InvalidCredentials);
        break;
      case 422:
        setFormState(FormStates.Rejected);
        break;
      default:
        navigateTo(`/error/${error!.code}`, {
          state: { message: error!.message },
        });
        break;
    }
  }, [credentialsApiClient, navigateTo]);

  useMount(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    form["isDataSharingAllowed"].checked = DATA_SHARING_ALLOWED_DEFAULT_STATE;
  });

  useEffect(() => {
    const eventTarget = eventTargetRef.current;
    eventTarget.addEventListener("loginform/submit", handleSubmit);
    return (): void => {
      eventTarget.removeEventListener("loginform/submit", handleSubmit);
    };
  }, [handleSubmit]);
  useTitle(docTitle);

  return {
    formState,
    formRef,
    cardTitle,
    cardDescription,
    urlControlStateVariant: useMemo<FormControlValidatedStateVariant>(() => {
      switch (formState) {
        case FormStates.Accepted:
          return "success";
        case FormStates.InvalidCredentials:
          return "success";
        case FormStates.Rejected:
          return "error";
        default:
          return "default";
      }
    }, [formState]),
    usernameControlStateVariant: _computeFormControlVariant(formState),
    passwordControlStateVariant: _computeFormControlVariant(formState),
    shouldDisableFormControl: useMemo(
      () => [FormStates.Submitting, FormStates.Accepted].includes(formState),
      [formState]
    ),
    isDataSharingAllowedCheckboxLabel,
    alertVariant: useMemo(() => {
      switch (formState) {
        case FormStates.Accepted:
          return AlertVariant.success;
        case FormStates.InvalidCredentials:
        case FormStates.Rejected:
          return AlertVariant.danger;
      }
    }, [formState]),
    alertTitle: useMemo(() => {
      switch (formState) {
        case FormStates.Accepted:
          return "Connected";
        case FormStates.InvalidCredentials:
          return "Invalid Credentials";
        case FormStates.Rejected:
          return "Error";
      }
    }, [formState]),
    alertDescriptionList: useMemo(() => {
      switch (formState) {
        case FormStates.Accepted:
          return [
            {
              id: 1,
              text: "The Migration Planner is now connected to your VMware environment",
            },
          ];
        case FormStates.InvalidCredentials:
          return [
            { id: 1, text: "Please double-check your entry for any typos." },
            {
              id: 2,
              text: "Verify your account has not been temporarily locked for security reasons.",
            },
          ];
        case FormStates.Rejected:
          return [
            {
              id: 1,
              text: "Please double-check the URL is correct and reachable from within the VM.",
            },
          ];
      }
    }, [formState]),
    shouldDisplayAlert: useMemo(
      () => ![FormStates.Initial, FormStates.Submitting].includes(formState),
      [formState]
    ),
    checkFormValidity: useCallback<React.FormEventHandler<HTMLFormElement>>(
      (event): void => {
        event.preventDefault();
        const form = formRef.current;
        if (!form) {
          return;
        }

        const ok = form.reportValidity();
        if (ok) {
          setFormState(FormStates.Submitting);
          eventTargetRef.current.dispatchEvent(new Event("loginform/submit"));
        }
      },
      [formRef]
    ),
  };
};
