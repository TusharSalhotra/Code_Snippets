import React from "react";
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import * as AppActions from '../redux/actions/app.actions';
import Icon, { Icons } from '../elements/Icon';
import { Colors } from "../styles/Colors";

const Container = styled.div`
  position: relative;
  background-color: ${Colors.Grey6};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  padding: 5px 8px;

  &:hover {
    cursor: pointer;
  }
`;

const Text = styled.div`
  font-size: 1.2rem;
  color: ${Colors.Grey1};
  font-weight: 800;
  margin-left: 5px;
`;

type BackButtonProps = {};

const BackButton: React.FC<BackButtonProps> = () => {
  /** Actions **/
  const dispatch = useDispatch();
  const navigateBackward = () => {
    dispatch(AppActions.setErrorEmpty());
    dispatch(AppActions.navigateBackward()
  )};

  /** Render **/
  return (
    <Container onClick={() => navigateBackward()}>
      <Icon icon={Icons.BackArrow} color={Colors.Grey1} size={12} />
      <Text>GO BACK</Text>
    </Container>
  );
};

export default BackButton;
