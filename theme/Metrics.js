import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Used via Metrics.baseMargin
const metrics = {
  padding: 10,
  marginHorizontal: 20,
  marginVertical: 20,
  section: 25,
  baseRadius: 30,
  borderLine: 0.5,
  inputHeight: 45,
  smallLine: 0.5,
  baseSpace: 10,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === 'ios' ? 64 : 54,
  buttonRadius: 12,
  borderRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50,
  },
  image: {
    item: {
      small: {
        width: 90,
        height: 90,
        borderRadius: 8,
      },
      big: {
        width,
        height: 500,
        backgroundColor: 'red',
      },
    },
    logo: {
      width: 150,
      height: 135,
    },
    avatar: {
      height: 90,
      width: 90,
      borderRadius: 100,
    },
  },
};

export default metrics;
