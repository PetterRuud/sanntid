// @flow

import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../theme';

export default StyleSheet.create({
  menuItem: {
    // marginLeft: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    flex: 1,
  },
  text: {
    ...Fonts.style.bold,
    // justifyContent: 'flex-start',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    color: Colors.text,
    paddingHorizontal: 20,
  },
  icon: {
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    color: Colors.red,
    marginBottom: -3,
  },
});
