import { Time } from "#/common/Time";

export const docTitle = "Virtualization Migration";
export const cardTitle = "Virtualization Migration Planner";
export const cardDescription = `
  The Migration Planner requires access to your VMware environment to execute a
  comprehensive discovery process that gathers essential data, including
  network topology, storage configuration, and virtual machine inventory. The
  process leverages this information to provide tailored recommendations for a
  seamless workload transition to OpenShift Virtualization.`.trim();
export const isDataSharingAllowedCheckboxLabel =
  "I agree to share aggregated data about my environment with Red Hat.";

export const DATA_SHARING_ALLOWED_DEFAULT_STATE = true;
export const REQUEST_TIMEOUT_SECONDS = 30 * Time.Second;
