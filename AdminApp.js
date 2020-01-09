import React from 'react';
import * as Permissions from 'expo-permissions';
import { View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';

import { registerRootComponent } from 'expo';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { ClientStateScreen } from './screens/ClientStateScreen';

class AdminApp extends React.Component {

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }

  handleBarCodeScanned = ({ data }) => {
    var clientId = JSON.parse(data).clientId;
    this.props.navigation.navigate('ClientStateScreen', { 'clientId': clientId });
  };
}

const AppNavigator = createStackNavigator({
  Home: AdminApp,
  ClientStateScreen: ClientStateScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default registerRootComponent(AppContainer);