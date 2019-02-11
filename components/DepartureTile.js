import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getIcon, getIconColor, groupBy, isVisible, getTransportHeaderIcons
} from '../Utils';

const DepartureTile = ({
  stopPlace, routes, hiddenRoutes, hiddenModes
}) => {
  const { departures, name, id } = stopPlace;
  const groupedDepartures = groupBy(departures, 'route');
  if (!isVisible(groupedDepartures, hiddenRoutes, hiddenModes)) {
    return null;
  }
  const color = '#9BA4D2';

  const transportHeaderIcons = getTransportHeaderIcons(stopPlace.departures, hiddenModes);

  return (
    <View style={styles.tile} key={id}>
      <View style={styles.tileHeader}>
        <Text style={styles.tileHeaderName}>{name}</Text>
        <View style={styles.tileHeaderNameIcons}>
          {transportHeaderIcons.map((Icon, index) => (
            <View style={styles.tileHeaderIcon} key={index}>
              <Icon height={30} width={30} color={color} />
            </View>
          ))}
        </View>
      </View>
      <View>
        {routes
          .filter(route => !hiddenRoutes.includes(route))
          .map((route) => {
            const subType = groupedDepartures[route][0].subType;
            const routeData = groupedDepartures[route].slice(0, 3);
            const routeType = routeData[0].type;
            const Icon = getIcon(routeType);
            const iconColor = getIconColor(routeType, subType);

            if (hiddenModes.includes(routeType)) {
              return null;
            }
            return (
              <View key={route} style={styles.tile}>
                <View style={styles.tileRoutename}>
                  <Icon height={24} width={24} color={iconColor} style={styles.tileRouteNameIcon} />
                  <Text style={styles.tileRouteNameText}>{route}</Text>
                </View>
                <View style={styles.tileRouteDepartures}>
                  {routeData.map((data, index) => (
                    <Text style={styles.tileRouteDeparturesTime} key={index}>
                      {data.time}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default DepartureTile;

const styles = StyleSheet.create({
  tile: {},
  tileHeader: {},
  tileHeaderIcons: {},
  tileHeaderIcon: {},
  tileRouteName: {},
  tileRouteNameIcon: {},
  tileRouteNameText: {},
  tileRouteDepartures: {},
  tileRouteDeparturesTime: {},
});
