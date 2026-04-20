import React, { useRef, useEffect, useCallback } from "react";
import * as ReactDOM from "react-dom";
// import { CloseOutlined } from "@ant-design/icons";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import Colors from "../../styles/Colors";
import ConfirmModal from "./ConfirmModal";
import GlobalCodeModal from "features/global-code/GlobalCodeModal";
import MachinesModal from "features/machines/MachinesModal";
import UsersModal from "features/users/UsersModal";
import AttributesModal from "./AttributesModal";
import MachineTypesModal from "features/machine-types/MachineTypesModal";
import JobTypeModal from "features/job-type/JobTypeModal";
import InventoryModal from "features/inventory/InventoryModal";
import HolidayModal from "features/holiday/HolidayModal";
import { Flex } from "components/SharedStyles";
import SegmentsModal from "features/segments/SegmentsModal";
import PartModal from "features/part/PartModal";
import ClientsModal from "features/clients/ClientsModal";
import StagesModal from "features/stages/StagesModal";
import GlobalCategoryCodeModal from "features/global-code-category/GlobalCategoryCodeModal";
import TemplatesModal from "features/templates/TemplatesModal";
import CloneTemplateModal from "features/templates/CloneTemplateModal";
import RolesAndPermissionsModal from "features/roles-and-permissions/RolesAndPermissionsModal";
import ManageRolesAndPermisionModal from "features/roles-and-permissions/ManageRolesAndPermisionModal";
import QuestionsModal from "features/questions/QuestionModal";
import AddOptionsModal from "features/questions/AddOptionsModal";
import CloseOutlined from "assets/Images/close.svg";
import { Image } from "antd";
import OrganizationsModal from "features/organizations/organizationsModal";

export enum ModalList {
  ConfirmAction = "ConfirmAction",
  GlobalCategoryCode = "GlobalCategoryCode",
  GlobalCode = "GlobalCode",
  Machines = "Machines",
  Attributes = "Attributes",
  Users = "Users",
  MachineTypes = "MachinesTypes;",
  JobType = "JobType",
  Inventory = "Inventory",
  Holiday = "Holiday",
  Segments = "Segments",
  Parts = "Parts",
  Clients = "Clients",
  IsConfirm = "IsConfirm",
  Templates = "Templates",
  CloneTemplate = "CloneTemplate",
  Stages = "Stages",
  // Questions = "Questions",
  RolesAndPermissions = "RolesAndPermissions",
  AssignRolesAndPermissions = "AssignRolesAndPermissions",
  Questions = "Questions",
  AddOptions = "AddOptions",
  Organizations = "Organizations",
}

type FullWidthProps = {
  width?: string;
};

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  /* justify-content: end; */
  align-items: center;
  z-index: 1000;
  transition: all 1s;
`;

const ModalWrapper = styled.div<{ minwidth?: string }>`
  width: 100%;
  min-width: 450px;
  max-width: ${(props) => props.minwidth || "100%"};
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1000;
  border-radius: 10px;

  /* Side Modal */
  /* height: 100vh; */
  form {
    width: 100%;
  }

  @media screen and (max-width: 991px) {
    max-width: 92%;
    min-width: unset;
    margin: 0 auto;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: ${Colors.Primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${Colors.Grey};
  z-index: 100;
  background: #fff;
  height: 50px;
  position: sticky;
  top: 0;
  left: 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  position: relative;
  padding-bottom: 10px;
`;

const CloseModalButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 11px;
  font-size: 20px;
  z-index: 10;
  color: ${Colors.Primary};
  border-radius: 0;
  transition: all 0.6s;
  padding: 2px;
  &:hover {
    background: #0588bb24;
    border-radius: 50%;
  }
`;
export const MainContent = styled.div`
  padding: 20px 15px;
  /* max-height: 500px; */
  overflow: auto;
`;

export const ModalFooter = styled(Flex)`
  padding: 10px 10px;
  border-top: 1px solid ${Colors.Grey};
  position: fixed;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: max-content;
  border-radius: 0 0 8px 8px;
  background: ${Colors.White};
  @media screen and (max-width: 991px) {
    width: 92%;
    margin: 0 auto;
    left: 4%;
  }
`;

export const ModalWidth = styled.div<FullWidthProps>`
  width: ${(props) => props.width || "900px"};
  max-width: 90vw;
  min-width: 550px;
  @media screen and (max-width: 991px) {
    min-width: initial;
  }
`;
interface IRenderModal {
  close: () => void;
  modalType: ModalList;
}

const RenderModal = ({ modalType, close, ...rest }: IRenderModal) => {
  return (
    <>
      {(() => {
        switch (modalType as ModalList) {
          case ModalList.GlobalCategoryCode:
            return <GlobalCategoryCodeModal {...rest} close={close} />;
          case ModalList.Machines:
            return <MachinesModal {...rest} close={close} />;
          case ModalList.GlobalCode:
            return <GlobalCodeModal {...rest} close={close} />;
          case ModalList.Attributes:
            return <AttributesModal {...rest} />;
          case ModalList.Users:
            return <UsersModal {...rest} close={close} />;
          case ModalList.MachineTypes:
            return <MachineTypesModal {...rest} close={close} />;
          case ModalList.JobType:
            return <JobTypeModal {...rest} close={close} />;
          case ModalList.Inventory:
            return <InventoryModal {...rest} close={close} />;
          case ModalList.Holiday:
            return <HolidayModal {...rest} close={close} />;
          case ModalList.Segments:
            return <SegmentsModal {...rest} close={close} />;
          case ModalList.Parts:
            return <PartModal {...rest} close={close} />;
          case ModalList.IsConfirm:
            return <ConfirmModal {...rest} close={close} />;
          case ModalList.Clients:
            return <ClientsModal {...rest} close={close} />;
          case ModalList.Templates:
            return <TemplatesModal {...rest} close={close} />;
          case ModalList.CloneTemplate:
            return <CloneTemplateModal {...rest} close={close} />;
          case ModalList.Stages:
            return <StagesModal {...rest} close={close} />;
          case ModalList.RolesAndPermissions:
            return <RolesAndPermissionsModal {...rest} close={close} />;
          // case ModalList.Questions:
          //   return <QuestionsModal {...rest} close={close} />;
          case ModalList.AssignRolesAndPermissions:
            return <ManageRolesAndPermisionModal {...rest} close={close} />;
          case ModalList.Questions:
            return <QuestionsModal {...rest} close={close} />;
          case ModalList.AddOptions:
            return <AddOptionsModal {...rest} close={close} />;
          // return <AddOptionsModal {...rest} />;
          case ModalList.Organizations:
            return <OrganizationsModal {...rest} close={close} />;
          default:
            return null;
        }
      })()}
    </>
  );
};

interface IModal {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  modalType: ModalList;
  title: string;
  setIsSuccess?: any;
  header?: string | number;
  isChildQuestion?: any;
  data?: any;
  loading?: boolean;
  id?: any;
  onConfirm?: any;
  isEdit?: boolean;
  type?: any;
  onClose?: any;
}

export const BaseModal = ({
  open,
  onClose = () => {},
  modalType,
  setOpen,
  title,
  ...rest
}: IModal) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: open ? 1 : 0,
    transform: open ? `translateY(0%)` : `translateY(-100%)`,
  });

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e?.target) {
      console.log("");
    }
  };

  const close = () => {
    setOpen(false);
  };

  const keyPress: any = useCallback(
    (e: React.KeyboardEvent<HTMLImageElement>) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [setOpen, open],
  );

  const handleClose = () => {
    setOpen(!open);
    onClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return ReactDOM.createPortal(
    <>
      {open ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper>
              <Header>
                <Title>{title}</Title>
                <CloseModalButton aria-label="Close modal" onClick={() => handleClose()}>
                  <Image height="30px" src={CloseOutlined} preview={false} />
                </CloseModalButton>
              </Header>
              <ModalContent>
                <RenderModal close={close} modalType={modalType} {...rest} />
              </ModalContent>
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>,
    document.body,
  );
};
