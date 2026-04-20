import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Colors from "../../styles/Colors";
import Button from "../elements/Button";
import { ModalFooter } from "./BaseModal";

const Container = styled.div`
  padding: 0;
  width: 100%;
`;

type ButtonContainerProps = {
  height?: string;
  noBorder?: boolean;
};

const ButtonContainer = styled.div<ButtonContainerProps>`
  margin: 10px 0 15px;
  height: ${(props) => (props.height ? props.height : "auto")};
  border-radius: 7px;
  min-height: 40px;
  gap: 30px;

  .confirmBtn {
    background-color: ${Colors.Grey4};
    border-color: ${Colors.Grey4};
    &:hover {
      color: ${Colors.Grey4} !important;
      border-color: ${Colors.Grey4} !important;
    }
  }
  .deleteBtn {
    background-color: ${Colors.White};
    color: ${Colors.Red1} !important;
    border-color: ${Colors.Red1};
    &:hover {
      background-color: ${Colors.Red1} !important;
      color: ${Colors.White} !important;
      border-color: ${Colors.Red1} !important;
    }
  }
  .primaryBtn {
    background-color: ${Colors.White};
    color: ${Colors.Primary} !important;
    border-color: ${Colors.Primary};
    &:hover {
      background-color: ${Colors.Primary} !important;
      color: ${Colors.White} !important;
      border-color: ${Colors.Primary} !important;
    }
  }
`;

interface IConfirmModal {
  header?: boolean;
  // noDelete: boolean;
  info?: string;
  loading?: boolean;
  onConfirm?: () => void;
  close: () => void;
}

const ConfirmModal: React.FC<IConfirmModal> = ({
  header,
  // noDelete,
  info,
  close,
  onConfirm = () => {},
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <Container>
      <h2
        style={{
          padding: "20px 20px",
          fontWeight: "500",
          textAlign: "center",
          fontSize: "1.4rem",
        }}
      >
        {header || t("deleteMessage")}
      </h2>
      {info && <p style={{ fontSize: "1.2rem" }}>{info}</p>}
      <ButtonContainer noBorder>
        <ModalFooter Justify="end" gap="10px">
          <Button
            text={t("confirm")}
            className={header ? "primaryBtn" : "deleteBtn"}
            onClick={() => onConfirm()}
            loading={loading}
            type="button"
          />
          <Button text={t("cancel")} className="confirmBtn" onClick={() => close()} type="button" />
        </ModalFooter>
      </ButtonContainer>
    </Container>
  );
};

export default ConfirmModal;
