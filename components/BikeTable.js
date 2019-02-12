import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getIcon } from '../utils';

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
          <BikeIcon height={32} width={32} color="#9BA4D2" />
        </View>
        <Text style={styles.tileHeaderText}>Bysykkel</Text>
      </View>
      {stations.map(({
        name, bikesAvailable, id, spacesAvailable
      }) => (
        <View key={id} style={styles.tileBike}>
          <View style={styles.tileBikeStation}>
            <View style={styles.tileBikeStationIcon}>
              <BikeIcon height={24} width={24} color="#D1D4E3" />
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
  tile: {},
  tileHeader: {},
  tileHeaderIcons: {},
  tileHeaderText: {},
  tileBike: {},
  tileBikeStation: {},
  tileBikeStationIcon: {},
  tileBikeAvailable: {},
});
