import normalize from '../lib/FontSizeHelpers';
import Colors from './Colors';

const type = {
  base: 'NunitoSans',
  bold: 'NunitoSansBold',
};

const size = {
  h1: normalize(40),
  h2: normalize(26),
  h3: normalize(20),
  h4: normalize(16),
  h5: normalize(20),
  h6: normalize(16),
  input: normalize(18),
  large: normalize(20),
  regular: normalize(18),
  medium: normalize(14),
  small: normalize(12),
  tiny: normalize(10),
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1,
    color: Colors.heading,
    fontWeight: 'bold',
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2,
    color: Colors.heading,
  },
  h3: {
    fontWeight: 'bold',
    fontSize: size.h3,
    color: Colors.heading,
  },
  h4: {
    fontWeight: 'bold',
    fontFamily: type.bold,
    fontSize: size.h4,
    color: Colors.darkGrey,
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5,
    color: Colors.heading,
  },
  h6: {
    fontWeight: 'bold',
    fontFamily: type.base,
    fontSize: size.h6,
    color: Colors.heading,
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
    color: Colors.text,
  },
  bold: {
    fontFamily: type.bold,
    fontSize: size.regular,
    color: Colors.text,
  },
  input: {
    fontFamily: type.bold,
    fontSize: size.input,
    color: Colors.text,
  },
  header: {
    fontFamily: type.bold,
    fontSize: size.medium,
    color: Colors.text,
  },
};

export default {
  type,
  size,
  style,
};
