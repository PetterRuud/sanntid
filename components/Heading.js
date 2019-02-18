import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Icon } from 'expo';

import { Colors } from '../theme';

import styles from './HeadingStyle';

export const Heading = ({
  align, size, style, color, children, showIcon, iconName,
}) => {
  let contentAlign = styles.alignCenter;

  switch (align) {
    case 'left':
      contentAlign = { justifyContent: 'flex-start' };
      break;
    case 'center':
      contentAlign = { justifyContent: 'center' };
      break;
    case 'right':
      contentAlign = { justifyContent: 'flex-end' };
      break;
    default:
      contentAlign = { justifyContent: 'center' };
      break;
  }

  let headingSize = styles.heading3;

  switch (size) {
    case 1:
      headingSize = styles.heading1;
      break;
    case 2:
      headingSize = styles.heading2;
      break;
    case 3:
      headingSize = styles.heading3;
      break;
    case 4:
      headingSize = styles.heading4;
      break;
    case 5:
      headingSize = styles.heading5;
      break;
    case 6:
      headingSize = styles.heading6;
      break;
    default:
      headingSize = styles.heading3;
      break;
  }
  return (
    <View style={[styles.container, contentAlign, style]}>
      <Text numberOfLines={4} style={[headingSize, color]}>
        {children}
      </Text>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? `ios-${iconName}` : `md-${iconName}`}
            size={26}
            style={[styles.icon]}
            color={Colors.primary}
          />
        </View>
      )}
    </View>
  );
};

export default Heading;
