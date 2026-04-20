import { Switch } from "antd";
import { Flex } from "components/SharedStyles";
import styled from "styled-components";

const CustomSwitch = styled(Switch)`
  .ant-form-item-control-input-content {
    display: flex;
  }
`;
const SwitchWrapper = styled(Flex)`
  height: 38px;
`;

const Toggle = ({ ...rest }: any) => {
  return (
    <SwitchWrapper Align="center">
      <CustomSwitch {...rest} />
    </SwitchWrapper>
  );
};

export default Toggle;
