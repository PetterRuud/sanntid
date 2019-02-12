import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import DepartureScreen from '../screens/DepartureScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Departure: DepartureScreen,
});

HomeStack.navigationOptions = {};

export default HomeStack;
