import React from 'react';
import moment from 'moment';
import {
  StyleSheet, Text, View, ScrollView, Button, Platform, FlatList,
} from 'react-native';
import { Constants } from 'expo';
import {
  getSettingsFromUrl,
  getPositionFromUrl,
  getStopPlacesByPositionAndDistance,
  sortLists,
  formatDeparture,
} from '../utils';
import { DEFAULT_DISTANCE } from '../constants';
import service from '../services';
import { BikeTable, DepartureTiles, HeaderIcon } from '../components';
// Styles
import { AppStyle } from '../theme';
import styles from './HomeScreenStyle';

const url = '/dashboard/@59-725065,10-842626/';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Sanntid',
    headerRight: (
      <HeaderIcon
        onPress={() => navigation.navigate('Search')}
        name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      stationData: [],
      stopsData: [],
      distance: DEFAULT_DISTANCE,
      hiddenStations: [],
      hiddenStops: [],
      hiddenRoutes: [],
      hiddenModes: [],
      position: '',
    };

    this.updateInterval = undefined;
  }

  componentDidMount() {
    const { navigation } = this.props;
    const bacon = navigation.getParam('position', url);
    const position = getPositionFromUrl(bacon);
    const {
      hiddenStations, hiddenStops, hiddenRoutes, distance, hiddenModes,
    } = getSettingsFromUrl(bacon);
    this.setState({
      initialLoading: true,
    });

    getStopPlacesByPositionAndDistance(position, distance)
      .then((stopsData) => {
        this.setState({
          stopsData,
          distance,
          hiddenStations,
          hiddenStops,
          hiddenRoutes,
          hiddenModes,
          position,
          initialLoading: false,
        });
      })
      .then(() => {
        this.initializeStopsData();
        this.updateTime();
      })
      .catch((e) => {
        this.setState({ initialLoading: false });
        console.error(e); // eslint-disable-line no-console
      });
    this.updateInterval = setInterval(this.updateTime, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  getHashedBikeStations = newStations => newStations.forEach((stationId) => {
    service.getBikeRentalStation(stationId).then((station) => {
      const { stationData } = this.state;
      const allStations = sortLists(stationData, [station]);
      this.setState({
        stationData: allStations,
      });
    });
  });

  getLineData = (departure) => {
    const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure;
    const { line } = serviceJourney.journeyPattern;
    const departureTime = moment(expectedDepartureTime);
    const minDiff = departureTime.diff(moment(), 'minutes');

    const route = `${line.publicCode || ''} ${destinationDisplay.frontText}`.trim();
    const transportMode = line.transportMode === 'coach' ? 'bus' : line.transportMode;
    const subType = departure.serviceJourney.transportSubmode;

    return {
      type: transportMode,
      subType,
      time: formatDeparture(minDiff, departureTime),
      route,
    };
  };

  initializeStopsData = () => {
    const { newStops } = getSettingsFromUrl(url);

    Promise.all(newStops.map(stopId => service.getStopPlace(stopId))).then((data) => {
      const { stopsData } = this.state;
      const stops = sortLists(stopsData, data);
      service
        .getStopPlaceDepartures(stops.map(({ id }) => id), { includeNonBoarding: false, departures: 50 })
        .then((departures) => {
          this.setState({
            stopsData: stops.map((stop) => {
              const resultForThisStop = departures.find(({ id }) => stop.id === id);
              if (!resultForThisStop || !resultForThisStop.departures) {
                return stop;
              }
              return {
                ...stop,
                departures: resultForThisStop.departures.map(this.getLineData),
              };
            }),
          });
        });
    });
  };

  stopPlaceDepartures = () => {
    const { stopsData } = this.state;
    service
      .getStopPlaceDepartures(stopsData.map(({ id }) => id), { includeNonBoarding: false, departures: 50 })
      .then((departures) => {
        this.setState({
          stopsData: stopsData.map((stop) => {
            const resultForThisStop = departures.find(({ id }) => stop.id === id);
            if (!resultForThisStop || !resultForThisStop.departures) {
              return stop;
            }
            return {
              ...stop,
              departures: resultForThisStop.departures.map(this.getLineData),
            };
          }),
        });
      });
  };

  updateTime = () => {
    const { position, distance } = this.state;
    const { newStations } = getSettingsFromUrl(url);

    service
      .getBikeRentalStations(position, distance)
      .then((stations) => {
        this.setState({
          stationData: stations,
        });
      })
      .then(() => {
        this.getHashedBikeStations(newStations);
      });
    this.stopPlaceDepartures();
  };

  renderNoStopsInfo = () => (
    <View className="no-stops">
      <View className="no-stops-sheep">
        <Text>Error</Text>
      </View>
    </View>
  );

  render() {
    const {
      hiddenStations,
      hiddenStops,
      hiddenRoutes,
      stationData,
      stopsData,
      hiddenModes,
      initialLoading,
    } = this.state;
    const visibleStopCount = stopsData.length - hiddenStops.length;
    const visibleStationCount = stationData.length - hiddenStations.length;
    const noStops = visibleStopCount + visibleStationCount === 0;

    if (noStops && !initialLoading) {
      return <View style={{ flex: 1, padding: 20 }}>{this.renderNoStopsInfo()}</View>;
    }

    return (
      <ScrollView style={AppStyle.screen.container}>
        <FlatList
          keyExtractor={(item, index) => item.id}
          data={stopsData}
          renderItem={() => (
            <DepartureTiles lineData={stopsData} visible={{ hiddenStops, hiddenRoutes, hiddenModes }} />
          )}
        />
        {visibleStationCount > 0 ? (
          <BikeTable stationData={stationData} visible={{ hiddenStations, hiddenModes }} />
        ) : null}
      </ScrollView>
    );
  }
}
