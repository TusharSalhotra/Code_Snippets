import { DatePicker as AntDatePicker, Form } from 'antd';
import { DatePickerProps as AntDatePickerProps } from 'antd/es/date-picker';
import { Moment } from 'moment';
import styled from 'styled-components';

// Styled component with proper margin and padding
const DatePickerContainer = styled.div`
  margin: 0 auto;
  padding: 0;
  
  .ant-picker {
    width: 100%;
    height: 38px;
  }

  .ant-form-item,
  .ant-select-in-form-item {
    margin: 0 0 8px 0; /* Adjusted margin to avoid unnecessary spacing */

    .ant-form-item-control-input {
      input {
        border-radius: 4px;
        width: 100%;

        &:hover,
        &:focus {
          border-color: red;
        }

        &:focus {
          box-shadow: none;
        }
      }
    }
  }
`;

// TypeScript interface for DatePicker component props
interface DatePickerProps {
  label?: React.ReactNode;
  name?: string;
  onChange?: (date: Moment | null, dateString: string) => void;
  size?: 'small' | 'middle' | 'large';
  value?: Moment | null;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  defaultValue?: Moment | null;
  initialValue?: Moment | null;
  format?: string;
  restProps?: AntDatePickerProps;
  fieldKey?: string;
  placeholder?: string;
  disabledDate?: (current: Moment) => boolean;
  allowClear?: boolean;
  locale?: any; // You may need to adjust this type based on the locale you are using
}

// DatePicker component
const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  onChange,
  size,
  value,
  disabled,
  required = false,
  requiredMessage,
  defaultValue,
  initialValue,
  format = 'DD/MM/YYYY',
  restProps,
  fieldKey,
  disabledDate,
  placeholder,
  locale,
  allowClear = true, // Default value for allowClear
}) => {
  return (
    <DatePickerContainer>
      <Form.Item
        name={name}
        fieldKey={fieldKey}
        initialValue={initialValue}
        label={label}
        rules={[
          {
            required,
            message: requiredMessage,
          },
        ]}
        {...restProps}
      >
        <AntDatePicker
          name={name}
          disabled={disabled}
          locale={locale}
          value={value}
          size={size}
          onChange={onChange}
          defaultValue={defaultValue}
          format={format}
          disabledDate={disabledDate}
          placeholder={placeholder}
          allowClear={allowClear} // Pass allowClear to AntDatePicker
        />
      </Form.Item>
    </DatePickerContainer>
  );
};

export default DatePicker;
