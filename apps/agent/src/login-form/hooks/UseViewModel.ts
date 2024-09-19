import { useState, useRef, useCallback, useMemo } from "react";
import { useMount, useTitle } from "react-use";
import { useNavigate } from "react-router-dom";
import { AlertVariant } from "@patternfly/react-core";
import type { Credentials } from "@migration-planner-ui/agent-client/models";
import type { AgentApiInterface } from "@migration-planner-ui/agent-client/apis";
import { useInjection } from "@migration-planner-ui/ioc";
import { newAbortSignal } from "#/common/AbortSignal";
import {
  DATA_SHARING_ALLOWED_DEFAULT_STATE,
  REQUEST_TIMEOUT_SECONDS,
} from "#/login-form/Constants";
import { FormStates } from "#/login-form/FormStates";
import { FormControlValidatedStateVariant } from "#/login-form/Aliases";
import { Symbols } from "#/main/Symbols";

export interface LoginFormViewModelInterface {
  formState: FormStates;
  formRef: React.MutableRefObject<HTMLFormElement | undefined>;
  urlControlStateVariant: FormControlValidatedStateVariant;
  urlControlHelperText?: string;
  usernameControlStateVariant: FormControlValidatedStateVariant;
  usernameControlHelperText?: string;
  passwordControlStateVariant: FormControlValidatedStateVariant;
  passwordControlHelperText?: string;
  shouldDisableFormControl: boolean;
  alertVariant?: AlertVariant;
  alertTitle?: string;
  alertDescriptionList?: Array<{ id: number; text: string }>;
  alertActionLinkText?: string;
  shouldDisplayAlert: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
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
  useTitle("Virtualization Migration");
  const navigateTo = useNavigate();
  const [formState, setFormState] = useState<FormStates>(FormStates.Initial);
  const formRef = useRef<HTMLFormElement>();
  const AgentApiClient = useInjection<AgentApiInterface>(Symbols.AgentApi);

  useMount(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    form["isDataSharingAllowed"].checked = DATA_SHARING_ALLOWED_DEFAULT_STATE;
  });

  return {
    formState,
    formRef,
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
    handleSubmit: useCallback<React.FormEventHandler<HTMLFormElement>>(
      async (event) => {
        event.preventDefault();
        const form = formRef.current;
        if (!form) {
          return;
        }

        const ok = form.reportValidity();
        if (ok) {
          setFormState(FormStates.Submitting);
        } else {
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
        const [statusCodeOK, error] = await AgentApiClient.putCredentials(
          credentials,
          {
            signal,
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
      },
      [AgentApiClient, navigateTo]
    ),
  };
};
