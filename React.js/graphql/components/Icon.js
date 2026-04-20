import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from '../styles/colors';
import { IconEnum } from './Icons';

export const Icons = IconEnum;

export default function Icon({
  icon = Icons.TagRegular,
  onClick = null,
  size = 25,
  top,
  left,
  right,
  position = 'relative',
  zIndex,
  active,
  activeColor = colors.seaGreen,
  inactiveColor = colors.grey3,
  margin,
}) {
  const color = active ? activeColor : inactiveColor;
  const cursor = onClick ? 'pointer' : null;
  return (
    <FontAwesomeIcon
      icon={icon}
      onClick={onClick}
      style={{
        color,
        top,
        left,
        right,
        position,
        zIndex,
        fontSize: size,
        transition: 'all 0.3s',
        cursor,
        margin,
      }}
    />
  );
}
