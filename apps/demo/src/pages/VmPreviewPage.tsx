import React from "react";
import { Bullseye, Backdrop } from "@patternfly/react-core";
import { LoginForm } from "#/login-form/LoginForm";
import { useViewModel } from "#/login-form/ViewModel";

const VmPreviewPage: React.FC = () => {
  const vm = useViewModel();

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

export default VmPreviewPage;
