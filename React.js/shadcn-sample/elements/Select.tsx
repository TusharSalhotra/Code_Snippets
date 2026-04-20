import { Select as AntSelect, SelectProps as AntSelectProps, Form } from "antd";
import styled from "styled-components";
import { InputContainer } from "./Input";

// Styled component for Ant Design Select
const CustomAntSelect = styled(AntSelect)`
  min-width: 100px;

  .ant-select-selector {
    box-shadow: none !important;
    border-radius: 5px !important;
    height: 38px !important;
  }
  .ant-select-selection-item {
    line-height: 38px !important;
  }
  .ant-form-item-control-input {
    height: 38px !important;
  }
  .ant-select-selection-search-input {
    position: relative;
    &:placeholder-shown {
      position: absolute;
      top: 2px;
    }
  }
  .ant-select-arrow {
    margin-top: -4px;
  }
`;

// Define the props interface
interface SelectProps extends Omit<AntSelectProps<any>, 'options'> {
  label?: string | number;
  requiredMessage?: string;
  required?: boolean;
  filterOptions?: boolean;
  options: { label: string; value: any }[]; // Adjusted to a more specific type
}

// Select component
const Select = ({
  label,
  showSearch = true,
  name,
  requiredMessage,
  loading,
  required = false,
  onChange,
  onFocus,
  initialValue,
  filterOptions = false,
  fieldKey,
  value,
  defaultValue,
  mode = 'default',
  disabled,
  restProps,
  options,
  placeholder,
  suffixIcon,
}: SelectProps) => {
  // Filter option function
  const filterOption = (input: string, option: any) =>
    option?.label?.toLowerCase()?.includes(input.toLowerCase());

  return (
    <InputContainer>
      <Form.Item
        label={label}
        {...restProps}
        fieldKey={fieldKey}
        name={name}
        initialValue={initialValue}
        rules={[
          {
            required,
            message: required ? requiredMessage : undefined,
          },
        ]}
      >
        <CustomAntSelect
          size="large"
          placeholder={placeholder}
          loading={loading}
          filterOption={filterOptions ? true : filterOption}
          value={value}
          showSearch={showSearch}
          mode={mode}
          options={options}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
          suffixIcon={suffixIcon}
        />
      </Form.Item>
    </InputContainer>
  );
};

export default Select;
