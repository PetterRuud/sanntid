import React from 'react';
import {
  StyleSheet, Text, View, Platform,
} from 'react-native';

import { Icon, LinearGradient } from 'expo';
import {
  getIcon, getIconColor, groupBy, isVisible, getTransportHeaderIcons,
} from '../utils';

import { Colors, Fonts, AppStyle } from '../theme';

const DepartureTile = ({
  stopPlace, routes, hiddenRoutes, hiddenModes,
}) => {
  const { departures, name, id } = stopPlace;
  const groupedDepartures = groupBy(departures, 'route');
  if (!isVisible(groupedDepartures, hiddenRoutes, hiddenModes)) {
    return null;
  }
  const color = '#9BA4D2';

  const transportHeaderIcons = getTransportHeaderIcons(stopPlace.departures, hiddenModes);

  return (
    <View key={id} style={styles.tile}>
      <View style={styles.tileHeader}>
        <Text style={styles.tileHeaderName}>{name}</Text>
        <View style={styles.tileHeaderNameIcons}>
          {transportHeaderIcons.map((iconName, index) => (
            <View style={styles.tileHeaderIcon} key={index}>
              <Icon.Ionicons
                name={Platform.OS === 'ios' ? `ios-${iconName}` : `md-${iconName}`}
                size={36}
                color={color}
                style={styles.tileRouteNameIcon}
              />
            </View>
          ))}
        </View>
      </View>
      <View>
        {routes
          .filter(route => !hiddenRoutes.includes(route))
          .map((route, index) => {
            const subType = groupedDepartures[route][0].subType;
            const routeData = groupedDepartures[route].slice(0, 3);
            const routeType = routeData[0].type;
            const iconName = getIcon(routeType);
            const iconColor = getIconColor(routeType, subType);

            if (hiddenModes.includes(routeType)) {
              return null;
            }
            return (
              <View key={route} style={styles.tileRoute}>
                {index !== 0 && <View style={styles.divider} />}

                <View style={styles.tileRouteName}>
                  <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `ios-${iconName}` : `md-${iconName}`}
                    size={26}
                    color={iconColor}
                    style={styles.tileRouteNameIcon}
                  />
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
    backgroundColor: Colors.card,
    padding: 16,
    margin: 10,
    borderRadius: 10,
    ...AppStyle.helpers.shadow,
  },
  tileHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileHeaderName: {
    ...Fonts.style.h2,
    marginBottom: 8,
    color: Colors.text,
  },
  tileHeaderIcons: {
    marginTop: 30,
    alignItems: 'center',
  },
  tileHeaderIcon: {
    marginLeft: 12,
  },
  tileRoute: {},
  divider: {
    marginBottom: 8,
    borderColor: Colors.divider,
    borderBottomWidth: 1,
  },
  tileRouteName: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileRouteNameIcon: {
    marginRight: 10,
  },
  tileRouteNameText: {
    ...Fonts.style.h4,
    color: Colors.text,
  },
  tileRouteDepartures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileRouteDeparturesTime: {
    ...Fonts.style.h5,
    marginBottom: 8,
    color: Colors.text,
  },
});
