import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SearchPanel } from '../components';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  addLocation = (position) => {
    this.goToDepartureBoard(position);
  };

  goToDepartureBoard(position) {
    const pos = `${position.lat},${position.lon}`.split('.').join('-');
    const { navigation } = this.props;
    navigation.navigate('Departure', {
      position: `/dashboard/@${pos}/`,
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <SearchPanel handleCoordinatesSelected={this.addLocation} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
