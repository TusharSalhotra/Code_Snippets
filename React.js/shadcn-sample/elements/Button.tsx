import { Button as AntButton } from 'antd';
import styled from 'styled-components';
import Colors from '../../styles/Colors';

// Define types for the ButtonContainer props
type ButtonContainerProps = {
  background?: string;
  width?: string;
  minWidth?: string;
  minHeight?: string;
  padding?: string;
  margin?: string;
  height?: string;
  xsWidth?: string;
};

// Styled component for the button
const ButtonContainer = styled(AntButton) <ButtonContainerProps>`
  -webkit-appearance: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width || 'auto'};
  padding: ${(props) => props.padding || '6px 25px'};
  min-height: ${(props) => props.minHeight || '38px'};
  min-width: ${(props) => props.minWidth || 'auto'};
  margin: ${(props) => props.margin || '0'};
  color: ${Colors.White};
  font-size: 16px;
  font-weight: bold;
  box-shadow: none;
  outline: none;
  transition: all 0.8s;

  &:focus-visible {
    box-shadow: none;
    outline: none;
  }

  &:hover {
    background: ${(props) => props.background || Colors.White};
    color: ${Colors.Primary};
    box-shadow: 0 0 3px #00588b inset;
  }

  &.ant-btn-default {
    background: ${(props) => props.background || Colors.White};
    color: ${Colors.Primary};
    box-shadow: 0 0 5px #00588b inset;

    &:hover {
      background: ${(props) => props.background || Colors.Primary};
      color: ${Colors.White};
    }
  }

  @media screen and (max-width: 991px) {
    height: ${(props) => props.height || 'auto'};
    font-size: 14px;
    width: ${(props) => props.width || 'auto'};
  }

  @media screen and (max-width: 450px) {
    width: ${(props) => props.xsWidth || 'auto'};
  }
`;

// Define types for the Button component props
type ButtonProps = {
  text: string;
  onClick?: () => void;
  margin?: string;
  type?: 'button' | 'reset' | 'submit';
  width?: string;
  background?: string;
  height?: string;
  disabled?: boolean;
  xsWidth?: string;
  padding?: string;
  minWidth?: string;
  minHeight?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
  className?: string;
  title?: string;
  variant?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
};

// Button component
const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  size = 'middle',
  icon,
  margin,
  type,
  width,
  background,
  height,
  disabled = false,
  xsWidth,
  padding,
  minWidth,
  minHeight,
  loading,
  className,
  title,
  variant = 'default',
}) => {
  return (
    <ButtonContainer
      background={background}
      htmlType={type}
      type={variant}
      onClick={onClick}
      margin={margin}
      icon={icon}
      loading={loading}
      size={size}
      width={width}
      xsWidth={xsWidth}
      height={height}
      disabled={disabled}
      padding={padding}
      minWidth={minWidth}
      minHeight={minHeight}
      className={className}
      title={title}
    >
      {text}
    </ButtonContainer>
  );
};

export default Button;