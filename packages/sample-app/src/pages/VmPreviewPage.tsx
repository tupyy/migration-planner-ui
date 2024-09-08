import React from "react";
import { Bullseye, Backdrop } from "@patternfly/react-core";
import { useLoginFormViewModel } from "#/login-form/useLoginFormViewModel";
import { LoginForm } from "#/login-form/LoginForm";

export const VmPreviewPage: React.FC = () => {
  const vm = useLoginFormViewModel();

  return (
    <>
      <Backdrop style={{ zIndex: 0 }} />
      <Bullseye>
        <LoginForm vm={vm} />
      </Bullseye>
    </>
  );
};

VmPreviewPage.displayName = "VmPreviewPage";
