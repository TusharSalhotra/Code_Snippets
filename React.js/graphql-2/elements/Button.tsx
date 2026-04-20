import React, { Fragment } from "react";
import styled from "styled-components";
import { Colors } from "../styles/Colors";
import * as Polished from 'polished';
import Loader, { LoaderSizes } from './Loader';

// import Icon from "./Icon";

export enum ButtonTypes {
  Submit = "Submit",
  Warning = "Warning",
};

export enum ButtonStates {
  Active = 'Active',
}

type StyledButtonProps = {
  type: string;
  onClick?: any;
  margin?: string;
  padding?: string;
  width?: string;
}

const StyledButton = styled.div<StyledButtonProps>`
  position: relative;
  height: 40px;
  width: ${props => props.width};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${props => {
    if (props.type === ButtonTypes.Submit) {
      return Colors.Pink;
    }

    if (props.type === ButtonTypes.Warning) {
      return Colors.Red;
    }
  }};
  border-radius: 10px;
  margin: ${(props: any) => (Boolean(props.margin) ? props.margin : "0px")};
  padding: ${(props: any) => (Boolean(props.padding) ? props.padding : "0px")};
  transition: all 0.2s;

  &:hover {
    cursor: ${props => props.onClick ? 'pointer' : null};
    background-color: ${props => {
      if (props.onClick && props.type === ButtonTypes.Submit) {
        return Polished.lighten(0.025, Colors.Pink);
      }

      if (props.onClick && props.type === ButtonTypes.Warning) {
        return Polished.lighten(0.025, Colors.Red);
      }
    }};
  }

  &:active {
    /* top: ${props => props.onClick ? '1px' : null}; */
    cursor: ${props => props.onClick ? 'pointer' : null};
    background-color: ${props => {
      if (props.onClick && props.type === ButtonTypes.Submit) {
        return Polished.darken(0.025, Colors.Pink);
      }

      if (props.onClick && props.type === ButtonTypes.Warning) {
        return Polished.darken(0.025, Colors.Red);
      }
    }};
  }
`;

type TextProps = {
  type: string;
  icon: boolean;
}

const Text = styled.span<TextProps>`
  color: ${(props: any) => {
    if (props.type === ButtonTypes.Submit) {
      return Colors.WhiteSmoke;
    }

    if (props.type === ButtonTypes.Warning) {
      return Colors.White;
    }
  }};
  margin-left: ${(props: any) => (props.icon ? "10px" : 0)};
  font-size: 1.4rem;
  font-weight: 700;
`;

export type ButtonProps = {
  type: string;
  state?: string;
  text: string;
  onClick?: any;
  icon?: string;
  margin?: string;
  padding?: string;
  width?: string;
  loading?: boolean;
};

export default function Button({
  type = ButtonTypes.Submit,
  state = ButtonStates.Active,
  text,
  onClick = () => {},
  icon,
  margin,
  padding,
  width = '100%',
  loading = false,
  
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      onClick={loading ? null : () => onClick() }
      margin={margin}
      padding={padding}
      width={width}
    >
      {(() => {
        return (
          <Fragment>
            {/* {icon && (
              <Icon
                icon={icon}
                color={Colors.Palette.Orange}
                margin="0 10px 0 0"
              />
            )} */}
            {(() => {
              if(loading) {
                return <Loader size={LoaderSizes.Small} color={Colors.White}/>
              }
              
              return (
                <Text type={type} icon={Boolean(icon)}>
                  {text}
                </Text>
              );
            })()}
          </Fragment>
        );
      })()}
    </StyledButton>
  );
}
