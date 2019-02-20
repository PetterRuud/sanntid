import React from 'react';
import {
  StyleSheet, Text, View, Button, Platform, ActivityIndicator,
} from 'react-native';
import {
  Constants, Location, Permissions, Icon,
} from 'expo';
import { AutoSuggest } from '../components';
// import { GeoLocation } from '../assets/icons';
import service from '../services';

import { AppStyle, Colors, Fonts } from '../theme';

const YOUR_POSITION = 'Posisjonen din';

const getSuggestionValue = suggestion => <Text>{suggestion.name}</Text>;

const renderSuggestion = (suggestion) => {
  if (suggestion.name === YOUR_POSITION) {
    return (
      <View style={styles.menuItem}>
        <Text style={styles.text}>{suggestion.name}</Text>
        <Icon.Ionicons
          name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
          size={26}
          style={styles.icon}
          color={Colors.primary}
        />
      </View>
    );
  }
  return (
    <View style={styles.menuItem}>
      <Text style={styles.text}>{suggestion.name}</Text>
      <Icon.Ionicons
        name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
        size={26}
        style={styles.icon}
        color={Colors.primary}
      />
    </View>
  );
};

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [{ name: YOUR_POSITION }],
      hasLocation: false,
      waiting: false,
      showPositionInList: true,
      selectedLocationName: '',
      errorMessage: null,
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
    }
  }

  getLocationAsync = async () => {
    const { suggestions } = this.state;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const suggestionsFiltered = suggestions.filter(s => s.name !== YOUR_POSITION);
    if (status !== 'granted') {
      this.setState({
        showPositionInList: false,
        suggestions: suggestionsFiltered,
      });
    } else {
      this.setState({
        suggestions: [{ name: YOUR_POSITION }, ...suggestionsFiltered],
      });
    }
  };

  onChange = (newValue) => {
    this.setState({
      value: newValue,
      errorMessage: undefined,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const { selectedLocationName } = this.state;
    if (value !== selectedLocationName) {
      this.setState({
        hasLocation: false,
        selectedLocationName: '',
        chosenCoord: '',
      });
    }
    this.getFeaturesDebounced(value);
  };

  getFeaturesDebounced = (value) => {
    const inputLength = value.trim().length;
    const { showPositionInList } = this.state;
    if (inputLength > 0) {
      service.getFeatures(value).then((featuresData) => {
        const suggestedFeatures = featuresData.map(({ geometry, properties }) => ({
          coordinates: {
            lon: geometry.coordinates[0],
            lat: geometry.coordinates[1],
          },
          name: `${properties.name}, ${properties.locality}`,
        }));
        const features = showPositionInList ? [{ name: YOUR_POSITION }, ...suggestedFeatures] : suggestedFeatures;
        this.setState({
          suggestions: features,
        });
      });
    }
  };

  getAddressFromPosition = (position) => {
    this.setState({
      value: YOUR_POSITION,
      chosenCoord: position,
      hasLocation: true,
      selectedLocationName: YOUR_POSITION,
    });
  };

  onSuggestionsClearRequested = () => {
    const { showPositionInList } = this.state;

    this.setState({
      suggestions: showPositionInList ? [{ name: YOUR_POSITION }] : [],
    });
  };

  onSuggestionSelected = async (event, { suggestion }) => {
    if (suggestion.name === YOUR_POSITION) {
      await this.setState({
        selectedLocationName: YOUR_POSITION,
        waiting: true,
      });
      const location = await Location.getCurrentPositionAsync({});
      this.handleSuccessLocation(location);
      // this.handleDeniedLocation();
    } else {
      await this.setState({
        chosenCoord: suggestion.coordinates,
        hasLocation: true,
        selectedLocationName: suggestion.name,
      });
    }

    await this.goToDepartureBoard();
  };

  handleSuccessLocation = (data) => {
    const position = { lat: data.coords.latitude, lon: data.coords.longitude };
    this.getAddressFromPosition(position);
    this.setState({
      waiting: false,
    });
  };

  handleDeniedLocation = (error) => {
    this.setState({
      value: '',
      suggestions: [],
      hasLocation: false,
      waiting: false,
      showPositionInList: false,
      selectedLocationName: '',
      errorMessage: this.getErrorMessage(error),
    });
    console.log('Permission denied with error: ', error); // eslint-disable-line
  };

  goToDepartureBoard = () => {
    const { chosenCoord } = this.state;
    const pos = `${chosenCoord.lat},${chosenCoord.lon}`.split('.').join('-');
    const { navigation } = this.props;
    navigation.replace('Home', {
      position: `/dashboard/@${pos}/`,
    });
  };

  renderSpinner = () => (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" />
    </View>
  );

  getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.';
      default:
        return 'En feil skjedde ved henting av din posisjon';
    }
  };

  render() {
    const {
      waiting, value, suggestions, errorMessage,
    } = this.state;

    const inputProps = {
      placeholder: 'Adresse eller sted',
      value,
      onFocus: () => {
        this.setState({
          errorMessage: undefined,
        });
      },
    };

    return (
      <View style={AppStyle.screen.container}>
        <View style={styles.searchSpinner}>
          <AutoSuggest
            suggestions={suggestions}
            shouldRenderSuggestions={() => true}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onChange={this.onChange}
            inputProps={inputProps}
          />
          {waiting && this.renderSpinner()}
        </View>
        {errorMessage && (
          <Text role="alert" style={{ color: 'red' }}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  menuItem: {
    // marginLeft: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    flex: 1,
  },
  text: {
    // justifyContent: 'flex-start',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...Fonts.style.normal,
  },
  icon: {
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: -3,
  },
});
