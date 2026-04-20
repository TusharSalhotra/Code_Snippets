import { CaretDownOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Image, MenuProps } from "antd";
import Link from "antd/es/typography/Link";
import LogoImg from "assets/Images/dashboardlogo.png";
import { Flex } from "components/SharedStyles";
import Button from "components/elements/Button";
import Select from "components/elements/Select";
import { SideBarWidth } from "components/side-nav/SideBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Colors from "styles/Colors";
import storage from "utils/storage";
import { setActiveLanguage, toggleSideNav } from "../../redux/app/appSlice";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  position: fixed;
  top: 0;
  left: ${SideBarWidth.width};
  z-index: 9;
  background: #fff;
  box-shadow: 10px 3px 10px #0000002a;
  padding: 0px 20px 0 0;
  transition: all 0.5s;
  left: 0;
  width: 100vw;
  box-shadow: 0 0 10px #00000011;
  justify-content: space-between;
`;
const NavHeader = styled.div`
  background: #e8e9ed;
  padding: 10px 11px;
  height: 70px;
  width: ${SideBarWidth.width};
`;
const LinkContainer = styled.div`
  justify-content: center;
  a {
    display: flex;
    gap: 4px;
    width: max-content;
    align-items: center;
    color: ${Colors.Primary};
  }
  .anticon-user {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.Grey};
    font-size: 20px;
    border-radius: 9px;
    color: ${Colors.Primary};
  }
`;

const HeaderColapse = styled(Flex)`
  justify-content: center;
  align-items: center;
  .anticon-menu {
    height: 37px;
    width: 37px;
    font-size: 18px;
    box-shadow: 0 0 10px #035b8a11;
    justify-content: center;
    color: ${Colors.Primary};
    background-color: #035b8a11;
  }
`;

const LanguageOption = [
  { value: "en", label: `🇺🇸 English ` },
  { value: "ar", label: `🇸🇦 عربى` },
];
function Header(props: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeLanguage } = useSelector((state: any) => state.app);
  const logout = () => {
    storage.clearToken();
    navigate("/login");
  };
  const onClick: MenuProps["onClick"] = () => {
    // message.info(`Click on item ${key}`);
    console.log("key");
  };

  const items: MenuProps["items"] = [
    {
      label: "Profile",
      key: "1",
    },
    {
      label: "Notification",
      key: "2",
    },
    {
      label: <Button text={t("logout")} icon={<LogoutOutlined />} onClick={logout} />,
      key: "3",
    },
  ];

  return (
    <>
      <HeaderWrapper className={props.className}>
        <HeaderColapse>
          <NavHeader>
            <Image src={LogoImg} preview={false} width="100%" />
          </NavHeader>
          <MenuOutlined onClick={() => dispatch(toggleSideNav())} />
        </HeaderColapse>
        <Flex gap="10px" Align="center">
          <Select
            options={LanguageOption}
            onChange={(updatedLanguage: any) => {
              dispatch(setActiveLanguage(updatedLanguage));
            }}
            defaultValue={activeLanguage}
          />

          <Dropdown menu={{ items, onClick }}>
            <LinkContainer>
              <Link>
                John Doe
                <UserOutlined />
                <CaretDownOutlined />
              </Link>
            </LinkContainer>
          </Dropdown>
        </Flex>
      </HeaderWrapper>
    </>
  );
}
export default Header;
