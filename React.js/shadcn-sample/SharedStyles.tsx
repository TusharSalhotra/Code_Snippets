import styled from "styled-components";
import Colors from "styles/Colors";
import {
  Badge as AntBadge,
  Breadcrumb as AntBreadcrumb,
  Card as AntCard,
  Drawer as AntDrawer,
  Dropdown as AntDropdown,
  Tree as AntTree,
} from "antd";

type FlexProps = {
  Justify?: string;
  gap?: string;
  width?: string;
  Align?: string;
  direction?: string;
  minWidth?: string;
  height?: string;
};

export const Flex = styled.div<FlexProps>`
  height: ${(props) => props.height || "100%"};
  display: flex;
  gap: ${(props) => props.gap || "10px"};
  width: ${(props) => props.width || "initial"};
  justify-content: ${(props) => props.Justify || "initial"};
  align-items: ${(props) => props.Align || "initial"};
  flex-direction: ${(props) => props.direction || "initial"};
  min-width: ${(props) => props.minWidth || "initial"};

  /* .ant-row-rtl & {
    justify-content: ${(props) => props.Justify || "end"};
  } */
`;

export const Spacer = styled.div<{ height?: string }>`
  height: ${(props) => props.height || "15px"};
`;

export const Card = styled.div`
  padding: 10px 15px 25px;
  background-color: ${Colors.White};
  border-radius: 3px;
  min-height: 100%;
`;

export const PageHeading = styled.div<{ borderWidth?: string }>`
  font-size: 18px;
  font-weight: 700;
  border: 0px solid ${Colors.SecondaryBlue};
  background-color: #035b8a1c;
  border-left-width: ${(props) => props.borderWidth || "10px"};
  padding: 13px 5px 13px 14px;
  margin-bottom: 20px;
`;
export const BreadcrumbContainer = styled(Flex)`
  padding: 5px 3px 8px;
  margin: 0px 0px 20px;
  border-bottom: 1px solid ${Colors.Grey};
  justify-content: space-between;
  align-items: center;
  height: max-content;
`;
export const Breadcrumb = styled(AntBreadcrumb)`
  font-weight: 400;
  ol {
    align-items: center;
  }
`;

export const BreadcrumbItem = styled(AntBreadcrumb.Item)<any>`
  color: ${(props) => (props.color ? props.color : Colors.Secondary)};
  cursor: pointer;
  font-size: 15px;
  opacity: 0.75;
  font-weight: 600;
`;
export const ActiveBreadcrumbItem = styled(BreadcrumbItem)`
  font-size: 18px;
  color: ${Colors.Primary};
  cursor: initial;
  opacity: 0.95;
  font-size: ${(props) => props.fontsize};
`;
export const Badge = styled(AntBadge)`
  color: ${(props) => props.color || Colors.green};
  background: ${Colors.lightGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
`;

export const InactiveBadge = styled(Badge)`
  color: ${(props) => props.color || Colors.Grey4};
  background: ${Colors.lightGrey};
`;
export const CustomCard = styled(AntCard)`
  border: 1px solid #f0f0f0;
  position: relative;
  width: 100%;
  height: max-content;
  z-index: 99;
  bottom: 120%;
  transition: all 1s;
  transition-delay: 0.5s;
  transition-property: position;
  &.open {
    bottom: initial;
  }
  .ant-card-head {
    background-color: #00588b;
    color: #fff;
    padding: 10px 20px;
    min-height: 35px;
  }
  .ant-card-body {
    padding: 24px 24px 5px !important;
  }
`;

export const DashboardTiles = styled.div<{ color?: string }>`
  border: 1px solid ${(props) => props.color || Colors.Orange}24;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 10px ${(props) => props.color || Colors.Orange}22;
  background-color: ${(props) => props.color || Colors.Orange}22;
  gap: 10px;
  color: ${(props) => props.color || Colors.Orange};
  border-radius: 25px;
`;

export const TileHeader = styled.div`
  font-size: 22px;
  font-weight: 600;
`;

export const Count = styled.div<{ color?: string }>`
  box-shadow: 0 0 10px ${(props) => props.color || Colors.Orange}22;
  width: max-content;
  padding: 5px 14px;
  font-size: 26px;
  font-weight: 900;
  border-radius: 11px;
  background: #ffffffbd;
  margin-left: auto;
`;

export const AttributeIcon = styled(Flex)`
  background-color: ${Colors.White};

  &.fadedBtn {
    opacity: 0.75;
    background-color: #e0e0e0;
    cursor: not-allowed;
    .anticon {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }
  }
  .anticon {
    box-shadow: none !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }

  cursor: pointer;
  box-shadow: 0 0 10px #00000011;
  padding: 5px 10px;
  border-radius: 5px;
  width: max-content;
  font-weight: 600;
  color: ${Colors.Primary};
  gap: 4px;
  font-size: 15px;
`;

export const Tree = styled(AntTree)<any>`
  .ant-tree-switcher-icon {
    background: #002f4d;
    color: #fff;
    padding: 9px;
    border-radius: 50%;
    position: relative;
    left: -6px;
    font-size: 14px !important;
  }
  .ant-tree-node-content-wrapper {
    padding: 3.5px 14px !important;
    text-transform: capitalize;
    font-size: 16px;
    font-weight: 700;
    color: #002f4d !important;
    display: flex;
    flex-direction: row-reverse;
    &:hover {
      background-color: transparent;
    }
  }
  .ant-tree-node-content-wrapper-normal {
    font-size: 14px;
    color: #000 !important;
    font-weight: 500;
  }
  .ant-tree-node-selected {
    background-color: transparent !important;
  }
  span.anticon {
    font-size: 17px;
    box-shadow: 0 0 10px #0000002a;
    padding: 4px;
    /* margin: 0 17px 0px 17px; */
    border-radius: 8px;
  }
`;

export const Drawer = styled(AntDrawer)`
  .ant-drawer & {
    position: relative;
    top: 200px !important;
    right: 20px !important;
    height: max-content;
    border-radius: 8px;
  }
  .ant-drawer-header-title {
    flex-direction: row-reverse;
  }
  .ant-drawer-body {
    position: relative;
    /* max-height: 81vh; */
    padding: 14px 0px 60px;
  }
`;

export const DrawerContent = styled.div`
  max-height: 400px;
  padding: 0 20px;

  overflow: hidden auto;
`;

export const DrawerFooter = styled(Flex)`
  border-top: 1px solid rgb(240, 240, 240);
  padding: 7px 13px;
  position: absolute;
  width: 100%;
  left: 0px;
  bottom: 0px;
  height: max-content;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  padding: 0 0 5px;
  width: max-content;
`;

export const Dropdown = styled(AntDropdown)`
  ul & {
    min-width: 170px;
  }

  .ant-dropdown-menu-item & {
    border-bottom: 1px solid #00588b;
    border-radius: 0px !important;
    background: #00588b11;
    margin-bottom: 4px !important;
    cursor: pointer;
    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
`;
