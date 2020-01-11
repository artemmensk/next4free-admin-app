import React from 'react';
import * as Permissions from 'expo-permissions';
import { View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';

export class QRScannerScreen extends React.Component {

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
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
