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
            <View style={styles.tileHeaderIcon} key={index} />
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
              <View key={route} style={styles.tileRoute}>
                <View style={styles.tileRouteName}>
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
  tile: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginHorizontal: 25,
    textShadowColor: '#585858',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10,
  },
  tileHeader: {
    justifyContent: 'space-between',
  },
  tileHeaderName: {
    fontSize: 35,
    fontWeight: '500',
    color: 'white',
    marginBottom: 10,
  },
  tileHeaderIcons: {
    marginTop: 30,
    alignItems: 'center',
  },
  tileHeaderIcon: {
    marginLeft: 12,
  },
  tileRoute: {
    marginBottom: 15,
    borderColor: '#A29FEF',
    borderBottomWidth: 1,
  },
  tileRouteName: {
    marginBottom: 10,
  },
  tileRouteNameIcon: {},
  tileRouteNameText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '400',
  },
  tileRouteDepartures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileRouteDeparturesTime: {
    color: '#61CBFD',
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 15,
  },
});
