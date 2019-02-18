import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { Icon } from 'expo';
import isEqual from 'lodash.isequal';

import {
  AppStyle, Colors, Fonts, Metrics,
} from '../theme';

export default class Autosuggest extends Component {
  constructor({ suggestions }) {
    super();

    this.state = {
      suggestions: suggestions || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { suggestions } = this.props;
    if (!isEqual(nextProps.suggestions, suggestions)) {
      this.setState({ suggestions: nextProps.suggestions });
    }
  }

  onSuggestionSelected(suggestion) {
    const { getSuggestionValue, onSuggestionSelected } = this.props;
    const suggestionValue = getSuggestionValue(suggestion);

    onSuggestionSelected(
      {},
      {
        suggestion,
        suggestionValue,
      },
    );
  }

  onChangeText = (value) => {
    const { onChange, onSuggestionsClearRequested, onSuggestionsFetchRequested } = this.props;
    onChange(value);

    if (value.length === 0) {
      onSuggestionsClearRequested();
    } else {
      onSuggestionsFetchRequested({ value });
    }
  };

  render() {
    const { renderSuggestion, inputProps } = this.props;
    const { suggestions } = this.state;
    return (
      <View style={{ height: Metrics.screenHeight }}>
        <TextInput
          onChangeText={this.onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={255}
          clearButtonMode="while-editing"
          keyboardAppearance="dark"
          style={AppStyle.form.search}
          placeholderTextColor={Colors.text}
          {...inputProps}
        />

        <KeyboardAvoidingView enableOnAndroid keyboardVerticalOffset={100}>
          <ScrollView>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => {
                  this.onSuggestionSelected(suggestion);
                }}
                key={index}
              >
                {renderSuggestion(suggestion)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  suggestion: {
    padding: 5,
    borderColor: Colors.divider,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.card,
  },
});
