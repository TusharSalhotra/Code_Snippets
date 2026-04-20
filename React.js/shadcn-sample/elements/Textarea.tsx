import { Input as AntInput } from "antd";
import styled from "styled-components";

const CustomTextArea = styled(AntInput.TextArea)`
  min-height: 38px !important;
  line-height: 30px !important;
  textarea {
    &:focus {
      box-shadow: none;
    }
  }
`;

const TextArea = ({ ...rest }: any) => {
  return <CustomTextArea rows={2} {...rest} />;
};

export default TextArea;
