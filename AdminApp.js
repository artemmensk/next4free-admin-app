import React from 'react';
import * as Permissions from 'expo-permissions';
import { View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';

import { registerRootComponent } from 'expo';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { ClientStateScreen } from './screens/ClientStateScreen';
import { QRScannerScreen } from './screens/QRScannerScreen'
import { SuccessStampScreen } from './screens/SuccessStampScreen'
import { SuccessCompleteScreen } from './screens/SuccessCompleteScreen'
import { ErrorScreen } from './screens/ErrorScreen'

const AppNavigator = createStackNavigator({
  QRScannerScreen: QRScannerScreen,
  ClientStateScreen: ClientStateScreen,
  SuccessStampScreen: SuccessStampScreen,
  SuccessCompleteScreen: SuccessCompleteScreen,
  ErrorScreen: ErrorScreen
});

const AppContainer = createAppContainer(AppNavigator);

class AdminApp extends React.Component {
  render() {
    return <AppContainer />;
  }
}

export default registerRootComponent(AdminApp);