import React from 'react';
import {
  StyleSheet, Text, View, Platform,
} from 'react-native';
import { Icon } from 'expo';
import { getIcon } from '../utils';

import { Colors, Fonts } from '../theme';

const BikeTable = ({ stationData, visible }) => {
  const { hiddenModes, hiddenStations } = visible;
  if (hiddenModes.includes('bike')) {
    return null;
  }
  const stations = stationData
    .filter(({ id }) => !hiddenStations.includes(id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const BikeIcon = getIcon('bike');
  return (
    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <View style={styles.tileHeaderIcons}>
          <Icon.Ionicons
            name={Platform.OS === 'ios' ? `ios-${BikeIcon}` : `md-${BikeIcon}`}
            size={26}
            color="#9BA4D2"
            style={styles.tileRouteNameIcon}
          />
        </View>
        <Text style={styles.tileHeaderText}>Bysykkel</Text>
      </View>
      {stations.map(({
        name, bikesAvailable, id, spacesAvailable,
      }) => (
        <View key={id} style={styles.tileBike}>
          <View style={styles.tileBikeStation}>
            <View style={styles.tileBikeStationIcon}>
              <Icon.Ionicons
                name={Platform.OS === 'ios' ? `ios-${BikeIcon}` : `md-${BikeIcon}`}
                size={26}
                color="#D1D4E3"
                style={styles.tileRouteNameIcon}
              />
            </View>
            <Text>{name}</Text>
          </View>

          <View style={styles.tileBikeAvailable}>
            <Text>
              {bikesAvailable}
              {' '}
              {bikesAvailable === 1 ? 'sykkel' : 'sykler'}
            </Text>
            <Text>
              {spacesAvailable}
              {' '}
              {spacesAvailable === 1 ? 'lås' : 'låser'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default BikeTable;

const styles = StyleSheet.create({
  tile: {
    backgroundColor: Colors.card,
    padding: 20,
    margin: 15,
    borderRadius: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  tileHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileHeaderIcons: {},
  tileHeaderText: {},
  tileBike: {
    marginBottom: 10,
    borderColor: Colors.primary,
    borderBottomWidth: 1,
  },
  tileBikeStation: {},
  tileBikeStationIcon: {},
  tileBikeAvailable: {},
});
