import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Icon } from 'expo';

import { Colors } from '../theme';

// Styles
import styles from './ListItemStyle';

export const ListItem = ({ onPress, isButton, children }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {children}
    {isButton && (
      <Icon.Ionicons
        name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
        size={26}
        style={styles.icon}
        color={Colors.primary}
      />
    )}
  </TouchableOpacity>
);

export default ListItem;
