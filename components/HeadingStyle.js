import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    alignSelf: 'flex-end',
  },
  icon: {
    color: Colors.inactive,
  },
  heading1: {
    ...Fonts.style.h1,
  },
  heading2: {
    ...Fonts.style.h2,
  },
  heading3: {
    ...Fonts.style.h3,
    flex: 1,
  },
  heading4: {
    ...Fonts.style.h4,
  },
  heading5: {
    ...Fonts.style.h5,
  },
  heading6: {
    ...Fonts.style.h6,
  },
});
