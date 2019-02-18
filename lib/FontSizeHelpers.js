import { Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

export default (size) => {
  if (deviceHeight === 568) {
    return size;
  }
  if (deviceHeight === 667) {
    return size * 1.2;
  }
  if (deviceHeight === 736) {
    return size * 1.4;
  }
  return size;
};
