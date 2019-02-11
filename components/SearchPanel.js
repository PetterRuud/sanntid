import React from 'react';
import {
  StyleSheet, Text, View, Button, Platform, ActivityIndicator
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { GeoLocation } from '../assets/icons';
import service from '../Service';

const YOUR_POSITION = 'Posisjonen din';

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = (suggestion) => {
  if (suggestion.name === YOUR_POSITION) {
    return (
      <View>
        {suggestion.name}
        <View style="location-icon">
          <Text>Geo</Text>
        </View>
      </View>
    );
  }
  return <Text>{suggestion.name}</Text>;
};

class SearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [{ name: YOUR_POSITION }],
      hasLocation: false,
      waiting: false,
      showPositionInList: true,
      selectedLocationName: '',
      location: null,
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

  componentDidMount() {}

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const suggestions = this.state.suggestions.filter(s => s.name !== YOUR_POSITION);
    if (status !== 'granted') {
      this.setState({
        showPositionInList: false,
        suggestions,
      });
    } else {
      this.setState({
        suggestions: [{ name: YOUR_POSITION }, ...suggestions],
      });
    }
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      errorMessage: undefined,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    if (value !== this.state.selectedLocationName) {
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

    if (inputLength > 0) {
      service.getFeatures(value).then((featuresData) => {
        const suggestedFeatures = featuresData.map(({ geometry, properties }) => ({
          coordinates: {
            lon: geometry.coordinates[0],
            lat: geometry.coordinates[1],
          },
          name: `${properties.name}, ${properties.locality}`,
        }));

        const features = this.state.showPositionInList
          ? [{ name: YOUR_POSITION }, ...suggestedFeatures]
          : suggestedFeatures;
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
      this.setState({
        selectedLocationName: YOUR_POSITION,
        waiting: true,
      });
      const location = await Location.getCurrentPositionAsync({});
      // this.handleSuccessLocation
      // this.handleDeniedLocation
    } else {
      this.setState({
        chosenCoord: suggestion.coordinates,
        hasLocation: true,
        selectedLocationName: suggestion.name,
      });
    }
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

  handleGoToBoard = () => {
    const coordinates = this.state.chosenCoord;
    return coordinates ? this.props.handleCoordinatesSelected(coordinates) : null;
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
    const { value, suggestions, errorMessage } = this.state;
    const inputProps = {
      placeholder: 'Adresse eller sted',
      value,
      onChange: this.onChange,
      onFocus: () => {
        this.setState({
          errorMessage: undefined,
        });
      },
    };

    const btnClass = !this.state.hasLocation ? 'locationFalse' : 'locationTrue';

    return (
      <React.Fragment>
        <View style={styles.search}>
          <View style={styles.searchInput}>
            <Text style={styles.searchLabel}>Område</Text>
            <View style={styles.searchSpinner}>
              <ReactAutosuggest
                suggestions={suggestions}
                shouldRenderSuggestions={() => true}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
              {this.state.waiting && this.renderSpinner()}
            </View>
          </View>
          <Button title="Opprett tavle" style={`${styles.search}${btnClass}`} onPress={this.handleGoToBoard} />
        </View>
        {errorMessage && (
          <Text role="alert" style={{ color: 'red' }}>
            {errorMessage}
          </Text>
        )}
      </React.Fragment>
    );
  }
}

export default SearchPanel;

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
