import { Checkbox as AntCheckbox, Form } from "antd";
import React from "react";

interface CheckBoxProps {
  label?: string;
  name?: string | string[]; // Ant Design expects name to be string or array of strings
  restProps?: React.InputHTMLAttributes<HTMLInputElement>;
  initialvalue?: boolean; // Since it's a checkbox, initial value should be boolean
  required?: boolean;
  requiredMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Specific event type
  text?: string | number;
  checked?: boolean;
  valuePropName?: string; // 'valuePropName' should be string as it refers to prop name
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  name,
  restProps,
  initialvalue = false,
  checked = false,
  required,
  requiredMessage,
  text,
  onChange,
  valuePropName = 'checked',
}: CheckBoxProps) => {
  return (
    <Form.Item
      label={label}
      name={name}
      valuePropName={valuePropName}
      initialValue={initialvalue}
      rules={[
        {
          required: required || false,
          message: required ? requiredMessage : undefined,
        },
      ]}
      {...restProps} // Make sure restProps is applied correctly to Form.Item
    >
      <AntCheckbox onChange={onChange} checked={checked}>
        {text}
      </AntCheckbox>
    </Form.Item>
  );
};

export default CheckBox;
