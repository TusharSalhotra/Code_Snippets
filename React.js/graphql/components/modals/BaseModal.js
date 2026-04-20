/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import colors from '../../styles/colors';
import AddTeamMemberModal from './AddTeamMemberModal';
import ImportContactsModal from './ImportContactsModal';
import SearchModal from './SearchModal';
import LogoutModal from './LogoutModal';
import EditRoleModal from './EditRoleModal';
import Icon from '../Icon';
import { IconEnum as Icons } from '../Icons';
import ChangePaymentMethodModal from './ChangePaymentMethodModal';
import CancelAccountModal from './CancelAccountModal';
import NewPaymentMethodModal from './NewPaymentMethodModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import TemplatesListModal from '../campaign/TemplateListModal';
import TemplateForm from '../templates/TemplateForm';
import DeleteConfirmModal from '../templates/DeleteConfirmModal';
import CampaignDetailsModal from '../campaign/mobile_ui/CampaignDetailsModal';
import ClientDetailsModal from '../superadmin/mobile_ui/ClientDetailsModal';
import ContactDetailsModal from '../customers/mobile_ui/ContactDetailsModal';
import PreviewCampaignModal from '../campaign/PreviewCampaignModal';
import ReferrerDetailsModal from '../dashboard/mobile_ui/ReferrerDetailsModal';
import SuperAdminContactDetailsModal from '../superadmin-customers/mobile_ui/ContactDetailsModal';

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  borderRadius: '5px',
  width: 'auto',
  height: 'auto',
  maxHeight: '90vh',
};

const Title = styled.div`
  font-weight: 500;
  font-size: 1.4rem;
  color: ${colors.grey1};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${colors.grey6};
`;

export const ModalList = Object.freeze({
  AddTeamMemberModal: 'Add Team Member',
  ImportContactsModal: 'Add Contacts',
  LogoutModal: 'Sign Out',
  EditRoleModal: 'Edit Role',
  SearchModal: 'Search Contacts By Phone Number',
  ChangePaymentMethod: 'Change Payment Method',
  CancelAccount: 'Cancel Account',
  NewPaymentMethod: 'Enter New Payment Method', // push if payment failed
  InvoiceDetails: 'Invoice Details',
  ImageUploadModal: 'Upload Image',
  ViewImageModal: 'View Image',
  AddTemplateModal: 'Add Template',
  EditTemplateModal: 'Edit Template',
  TemplateListModal: 'Select A Template',
  DeleteTemplateModal: 'Delete Template',
  DeleteCampaignModal: 'Delete Campaign',
  CampaignDetailsModal: 'Campaign Details',
  ClientDetailsModal: 'Client Details',
  ContactDetailsModal: 'Customer Details',
  CampaignSendConfirm: 'Send Campaign',
  RedeemConfirmModal: 'Redeem Discount',
  PreviewCampaignModal: 'Preview Campaign',
  ReferrerDetailsModal: 'Referrer Details',
  SuperAdminContactDetailsModal: 'Contact Details',
  SetMmsEnabledModal: 'Confirm MMS Enabled',
});

export default function BaseModal({
  open, modalType, onClose, ...rest
}) {
  const renderModal = (modalType, close) => {
    switch (modalType) {
      case ModalList.AddTeamMemberModal:
        return <AddTeamMemberModal close={close} />;
      case ModalList.ImportContactsModal:
        return <ImportContactsModal {...rest} close={close} />;
      case ModalList.LogoutModal:
        return <LogoutModal close={close} />;
      case ModalList.EditRoleModal:
        return <EditRoleModal close={close} />;
      case ModalList.SearchModal:
        return <SearchModal close={close} {...rest} />;
      case ModalList.ChangePaymentMethod:
        return <ChangePaymentMethodModal close={close} />;
      case ModalList.CancelAccount:
        return <CancelAccountModal close={close} />;
      case ModalList.NewPaymentMethod:
        return <NewPaymentMethodModal close={close} />;
      case ModalList.InvoiceDetails:
        return <InvoiceDetailsModal close={close} />;
      case ModalList.AddTemplateModal:
        return <TemplateForm close={close} {...rest} />;
      case ModalList.EditTemplateModal:
        return <TemplateForm close={close} {...rest} />;
      case ModalList.TemplateListModal:
        return <TemplatesListModal close={close} {...rest} />;
      case ModalList.DeleteTemplateModal:
        return <DeleteConfirmModal close={close} {...rest} />;
      case ModalList.CampaignSendConfirm:
        return <DeleteConfirmModal close={close} {...rest} />;
      case ModalList.DeleteCampaignModal:
        return <DeleteConfirmModal close={close} {...rest} />;
      case ModalList.CampaignDetailsModal:
        return <CampaignDetailsModal close={close} {...rest} />;
      case ModalList.ClientDetailsModal:
        return <ClientDetailsModal close={close} {...rest} />;
      case ModalList.ContactDetailsModal:
        return <ContactDetailsModal close={close} {...rest} />;
      case ModalList.RedeemConfirmModal:
        return <DeleteConfirmModal close={close} {...rest} />;
      case ModalList.PreviewCampaignModal:
        return <PreviewCampaignModal close={close} {...rest} />;
      case ModalList.ReferrerDetailsModal:
        return <ReferrerDetailsModal close={close} {...rest} />;
      case ModalList.SuperAdminContactDetailsModal:
        return <SuperAdminContactDetailsModal close={close} {...rest} />;
      case ModalList.SetMmsEnabledModal:
        return <DeleteConfirmModal close={close} {...rest} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const HamBergerElement = document.getElementById('hamberger');

    if (HamBergerElement?.style) {
      if (open) {
        // set hamberger index to negitive
        HamBergerElement.style.zIndex = '1';
      } else {
        // set positive index
        HamBergerElement.style.zIndex = '20';
      }
    }
  }, [open, modalType]);

  return (
    <Popup
      modal
      open={open}
      closeOnDocumentClick={false}
      onClose={() => onClose(false)}
      contentStyle={modalStyle}
    >
      {(close) => (
        <>
          <Header>
            <Title>{modalType}</Title>
            <Icon
              icon={Icons.TimesCircleSolid}
              onClick={() => close()}
              size={15}
            />
          </Header>
          {renderModal(modalType, close)}
        </>
      )}
    </Popup>
  );
}
