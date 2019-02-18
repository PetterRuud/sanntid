import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'expo';

import { Colors } from '../theme';
import styles from './HeaderIconStyle';

export const HeaderIcon = ({ onPress, name, size }) => (
  <TouchableOpacity onPress={() => onPress()} style={styles.icon}>
    <Icon.Ionicons name={name} size={size || 36} color={Colors.headerText} />
  </TouchableOpacity>
);

export default HeaderIcon;
