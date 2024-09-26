import React, { useCallback, useState } from "react";
import {
  Tooltip,
  Button,
  Icon,
  TextContent,
  Text,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { ConfirmationModal } from "#/components/ConfirmationModal";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RemoveSourceAction {
  export type ConfirmEventHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> & {
      dismissConfirmationModal: () => void;
      showConfirmationModal: () => void;
    }
  ) => void;
  export type Props = {
    sourceId: string;
    isDisabled: boolean;
    onConfirm?: ConfirmEventHandler;
  };
}

export const RemoveSourceAction: React.FC<RemoveSourceAction.Props> = (
  props
) => {
  const { sourceId, isDisabled = false, onConfirm } = props;

  const [shouldShowConfirmationModal, setShouldShowConfirmationModal] =
    useState(false);
  const dismissConfirmationModal = useCallback((): void => {
    setShouldShowConfirmationModal(false);
  }, []);
  const showConfirmationModal = useCallback((): void => {
    setShouldShowConfirmationModal(true);
  }, []);

  const handleConfirm = useCallback<RemoveSourceAction.ConfirmEventHandler>(
    (event) => {
      if (onConfirm) {
        event.dismissConfirmationModal = dismissConfirmationModal;
        onConfirm(event);
      }
    },
    [dismissConfirmationModal, onConfirm]
  );

  return (
    <>
      <Tooltip content="Remove">
        <Button
          data-source-id={sourceId}
          variant="plain"
          isDisabled={isDisabled}
          onClick={showConfirmationModal}
        >
          <Icon size="md" isInline>
            <TrashIcon />
          </Icon>
        </Button>
      </Tooltip>
      {onConfirm && shouldShowConfirmationModal && (
        <ConfirmationModal
          title="Remove discovery source?"
          titleIconVariant="warning"
          primaryButtonVariant="danger"
          isOpen={shouldShowConfirmationModal}
          isDisabled={isDisabled}
          onCancel={dismissConfirmationModal}
          onConfirm={handleConfirm}
        >
          <TextContent>
            <Text id="confirmation-modal-description">
              The discovery information will be lost.
            </Text>
          </TextContent>
        </ConfirmationModal>
      )}
    </>
  );
};

RemoveSourceAction.displayName = "RemoveSourceAction";
