import { Input as AntInput, Form } from "antd";
import styled from "styled-components";

const InputContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  
  .ant-input-affix-wrapper {
    padding: 0 11px;
  }
  
  .ant-form-item,
  .ant-select-in-form-item {
    margin: 0;

    .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled) {
      border-radius: 4px;
      width: 100%;
      box-shadow: none;

      &:focus,
      &:hover {
        box-shadow: none;
      }
    }

    .ant-form-item-control-input {
      input {
        border-radius: 4px;
        width: 100%;
        height: 38px;

        &:focus {
          box-shadow: none;
        }
      }
    }
  }
`;

interface InputProps {
  label?: string | number;
  name?: string;
  requiredMessage?: string;
  required?: boolean;
  padding?: string;
  margin?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  pattern?: RegExp;
  initialValue?: any;
  regexMessage?: string;
  fieldKey?: string;
  value?: string;
  disabled?: boolean;
  error?: string | number;
  restProps?: any;
  type?: "text" | "password" | "number";
  placeholder?: string;
  suffix?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  requiredMessage,
  required = false,
  pattern,
  regexMessage,
  placeholder,
  initialValue,
  type = "text",
  value,
  onChange = () => { },
  restProps,
  onFocus = () => { },
  fieldKey,
  disabled,
  error,
  suffix,
}) => {
  const getInputComponent = (inputType: string) => {
    switch (inputType) {
      case "password":
        return (
          <AntInput.Password
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            disabled={disabled}
            suffix={suffix}
          />
        );
      case "number":
        return (
          <AntInput
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            disabled={disabled}
            suffix={suffix}
          />
        );
      default:
        return (
          <AntInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            disabled={disabled}
            suffix={suffix}
          />
        );
    }
  };

  return (
    <InputContainer>
      <Form.Item
        label={<>{label}</>}
        {...restProps}
        fieldKey={fieldKey}
        name={name}
        initialValue={initialValue?.toString()}
        rules={[
          {
            required,
            message: required ? requiredMessage : undefined,
          },
          pattern && {
            pattern,
            message: regexMessage,
          },
        ]}
      >
        {getInputComponent(type)}
      </Form.Item>
    </InputContainer>
  );
};

export default Input;
