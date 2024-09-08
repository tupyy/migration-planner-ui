export type FormControlValidatedStateVariant =
  | "success"
  | "warning"
  | "error"
  | "default";

export const enum FormStates {
  Initial = "initial",
  Submitting = "submitting",
  Accepted = "accepted",
  Rejected = "rejected",
  InvalidCredentials = "invalidCredentials",
}

import type { AlertVariant } from "@patternfly/react-core";

export interface LoginFormViewModel {
  formState: FormStates;
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
  formCallbackRef: (node: HTMLFormElement) => void;
  checkFormValidity: React.FormEventHandler<HTMLFormElement>;
}
