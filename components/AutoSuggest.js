import React, { Component } from 'react';

import {
  View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView,
} from 'react-native';
import isEqual from 'lodash.isequal';

const defaultShouldRenderSuggestions = value => value.trim().length > 0;

export default class Autosuggest extends Component {
  constructor({ suggestions, defaultValue }) {
    super();

    this.state = {
      focused: false,
      suggestions: suggestions || [],
      value: defaultValue || '',
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

    this.setState({
      value: suggestionValue,
    });

    this.close();
  }

  onChangeText = (value) => {
    const { inputProps, onSuggestionsClearRequested, onSuggestionsFetchRequested } = this.props;
    inputProps.onChangeText(value);
    if (value.length === 0) {
      onSuggestionsClearRequested();
    } else {
      onSuggestionsFetchRequested({ value });
    }

    this.setState({
      value,
    });
  };

  getField(optionalProps) {
    const { inputProps } = this.props;
    const { value } = this.state;
    console.log('VALUE', value);
    return (
      <TextInput
        {...inputProps}
        onChangeText={this.onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={255}
        placeholder={inputProps.placeholder}
        style={{
          marginBottom: 0,
          height: 60,
        }}
        {...optionalProps}
      />
    );
  }

  close = () => {
    this.setState({ focused: false });
  };

  render() {
    const { renderSuggestion, onRequestClose, childKey } = this.props;
    const { suggestions, focused } = this.state;
    return (
      <View>
        {this.getField({
          onFocus: () => this.setState({ focused: true }),
        })}
        <Modal animationType="slide" visible={focused} onRequestClose={onRequestClose}>
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView keyboardShouldPersistTaps="handled" extraHeight={20} enableOnAndroid>
              {this.getField({
                autoFocus: true,
              })}

              {suggestions.map((suggestion, i) => (
                <TouchableOpacity
                  onPress={(event) => {
                    this.onSuggestionSelected(suggestion);
                  }}
                  key={childKey ? suggestion[childKey] : i}
                >
                  {renderSuggestion(suggestion)}
                </TouchableOpacity>
              ))}
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    );
  }
}
