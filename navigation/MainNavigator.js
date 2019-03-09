import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';

import { Colors, Fonts, AppStyle } from '../theme';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.header,
        borderBottomWidth: 0,
        ...AppStyle.helpers.shadow,
      },
      headerTintColor: Colors.text,
      headerTitleStyle: {
        ...Fonts.style.h2,
      },
    },
  },
);

export default HomeStack;
