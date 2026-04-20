import {
  ApartmentOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ClusterOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd/es/menu";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Colors from "styles/Colors";

type MenuItem = Required<MenuProps>["items"][number];

export enum SideBarWidth {
  width = "250px",
}
export enum MenuBorderRadius {
  borderRadius = "8px",
}

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const SideMenus = styled(Menu)`
  height: calc(100vh - 70px) !important;
  width: 100% !important;
  padding: 20px 5px;
  background: ${Colors.Secondary};
  color: #fff;
  overflow-y: auto !important;
  font-size: 16px;
  transition: all 0.5s;
  .ant-menu-item {
    padding: 10px 10px 10px 15px !important;
    border-radius: ${MenuBorderRadius.borderRadius};
    font-size: 18px;
    /* border-bottom: 1px solid #fff; */
    /* border-radius: 0; */
    &:last-child {
      border: none;
    }
    &:hover,
    &:focus {
      /* background: #fff !important;
      color: #1d2531 !important; */

      background: #c0c8e7 !important;
      color: #1d2531 !important;
      svg {
        fill: #1d2531;
      }
      a {
        color: #1d2531;
      }
      &.ant-menu-item-selected {
        background: ${Colors.White};
        color: ${Colors.Secondary};
      }
    }
    &.ant-menu-item-selected {
      background: ${Colors.White};
      color: ${Colors.Secondary};
    }
    svg {
      font-size: 22px !important;
    }
  }
  .ant-menu-submenu {
    /* border-bottom: 1px solid #fff; */
    svg {
      font-size: 19px !important;
    }
    border-radius: ${MenuBorderRadius.borderRadius};
    .ant-menu-submenu-title {
      border-radius: ${MenuBorderRadius.borderRadius};
      font-size: 18px;
      &:active,
      &:hover {
        /* background: ${Colors.White};
        color: ${Colors.Secondary} !important; */
        background: #c0c8e7 !important;
        color: #1d2531 !important;
      }
    }
    .ant-menu-title-content {
      a {
        color: ${Colors.White} !important;
      }
    }
    .ant-menu-sub {
      background: ${Colors.SecondaryBlue} !important;
      padding-left: 25px !important;
      padding: 10px 5px 10px 15px !important;

      .ant-menu-item {
        padding: 0 0 0 15px !important;
        position: relative;
        font-size: 18px;
        &.ant-menu-item-selected,
        &:hover,
        &:focus {
          .ant-menu-title-content {
            a {
              color: ${Colors.Secondary} !important;
            }
          }

          .ant-menu-item-icon {
            border-color: ${Colors.Secondary};
          }
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 5px;
    background-color: ${Colors.White};
    color: ${Colors.Grey3};
    border: 1px solid ${Colors.Grey3};
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${Colors.Grey3};
    border-radius: 6px;
  }
`;

const SideBarWrapper = styled.div<{ width?: string }>`
  height: 100vh;
  width: ${SideBarWidth.width};
  position: fixed;
  top: 70px;
  bottom: 0;
  left: ${SideBarWidth.width};
  &.open {
    left: 0;
  }
`;

const CircleIcon = styled.span`
  height: 14px;
  border: 1.5px solid ${Colors.White};
  border-radius: 50%;
`;

const SideBar = (props: any) => {
  const { t } = useTranslation();
  const items: MenuItem[] = [
    // menu items start
    getItem(
      <Link title={`${t("dashboard")}`} to="/dashboard">
        {t("dashboard")}
      </Link>,
      "/dashboard",
      <DashboardOutlined />,
    ),
    getItem(`${t("manage")}`, "/manage", <AppstoreOutlined />, [
      // manage - submenu - start
      getItem(
        <Link title={`${t("jobTypes")}`} to="/job-types">
          {t("jobTypes")}
        </Link>,
        "/manage-job-types",
        <CircleIcon />,
      ),
      getItem(
        <Link title={`${t("machineTypes")}`} to="/machine-types">
          {t("machineTypes")}
        </Link>,
        "/manage-machine-types",
        <CircleIcon />,
      ),
      getItem(
        <Link title={`${t("machines")}`} to="/machines">
          {t("machines")}
        </Link>,
        "/manage-machine",
        <ToolOutlined />,
      ),
      getItem(
        <Link title={`${t("segments")}`} to="/segments">
          {t("segments")}
        </Link>,
        "/manage-segments",
        <ApartmentOutlined />,
      ),
      getItem(
        <Link title={`${t("parts")}`} to="/parts">
          {t("parts")}
        </Link>,
        "/manage-parts",
        <ApartmentOutlined />,
      ),
      getItem(
        <Link title={`${t("inventory")}`} to="/inventory">
          {t("inventory")}
        </Link>,
        "/manage-inventory",
        <CircleIcon />,
      ),
      getItem(
        <Link title={`${t("globalCodeCategory")}`} to="/category-codes">
          {t("globalCodeCategory")}
        </Link>,
        "/manage-category-codes",
        <CircleIcon />,
      ),
      getItem(
        <Link title={`${t("globalCode")}`} to="/global-codes">
          {t("globalCode")}
        </Link>,
        "/manage-global-codes",
        <CircleIcon />,
      ),
      getItem(
        <Link title={`${t("scopeOfWork")}`} to="/scope-of-work">
          {t("scopeOfWork")}
        </Link>,
        "/manage-scope-of-work",
        <FileSearchOutlined />,
      ),
      getItem(
        <Link title={`${t("additionalWorkingHours")}`} to="/additional-work-hours">
          {t("additionalWorkingHours")}
        </Link>,
        "/manage-additional-work-hours",
        <ClockCircleOutlined />,
      ),
      getItem(
        <Link title={`${t("timeTable")}`} to="/time-table">
          {t("timeTable")}
        </Link>,
        "/manage-time-table",
        <CalendarOutlined />,
      ),
      getItem(<Link to="/holidays">{t("holidays")}</Link>, "/holidays", <CalendarOutlined />),
      getItem(<Link to="/stages">{t("stage")}</Link>, "/stages", <ClusterOutlined />),
      // manage - submenu - end
    ]),

    getItem(<Link to="/users">{t("users")}</Link>, "/users", <UserOutlined />),
    getItem(<Link to="/clients">{t("clients")}</Link>, "/clients", <TeamOutlined />),
    getItem(<Link to="/templates">{t("templates")}</Link>, "/templates", <FileTextOutlined />),
    getItem(<Link to="/jobs-list">{t("jobsList")}</Link>, "/jobs-list", <OrderedListOutlined />),
    getItem(
      <Link to="/questions">{t("questions")}</Link>,
      "/questions",
      <QuestionCircleOutlined />,
    ),

    getItem(`${t("reports")}`, "/reports", <AppstoreOutlined />, [
      // report - submenu - start
      getItem(
        <Link to="/job-details"> {t("jobDetails")} </Link>,
        "/report-job-details",
        <CircleIcon />,
      ),
      getItem(<Link to="/job-hours"> {t("jobHours")} </Link>, "/report-job-hours", <CircleIcon />),
      getItem(
        <Link to="/job-inventory"> {t("jobInventory")} </Link>,
        "/report-job-inventory",
        <CircleIcon />,
      ),
      getItem(
        <Link to="/abc-performance"> {t("becPerformance")} </Link>,
        "/report-abc-performance",
        <CircleIcon />,
      ),
      getItem(<Link to="/technician"> {t("technician")} </Link>, "/technician", <CircleIcon />),
      getItem(
        <Link to="/technicianpoints"> {t("technicianProductivePoints")} </Link>,
        "/technicianpoints",
        <CircleIcon />,
      ),
    ]),

    getItem(
      <Link title={`${t("rolesAndPermissions")}`} to="/roles-permissions">
        {t("rolesAndPermissions")}
      </Link>,
      "/roles-permissions",
      <SettingOutlined />,
    ),
  ];
  return (
    <SideBarWrapper className={props.className}>
      <SideMenus
        defaultSelectedKeys={["/dashboard"]}
        defaultOpenKeys={[]}
        mode="inline"
        theme="dark"
        items={items}
      />
    </SideBarWrapper>
  );
};

export default SideBar;
