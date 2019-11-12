import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Permissions from 'expo-permissions';

import { BarCodeScanner } from 'expo-barcode-scanner';

const businessId = "hardcoded business id"

export default class App extends React.Component {
  state = {
    scanned: false
  }
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
        <View style={styles.header}>
          <Text>header</Text>
        </View>
        <View style={styles.body}>
          {!this.state.scanned ? (
            <BarCodeScanner
              onBarCodeScanned={this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
              <View>
                <Text>Scanned data:</Text>
                <Text>{this.state.scannedData}</Text>
              </View>
            )}
        </View>
        <View style={styles.footer}>
          <Button title={'Scan'} onPress={() => this.setState({ scanned: false })} />
          <Button title={'Stamp'} onPress={() => this.stamp()} />
          <Button title={'Complete'} onPress={() => this.complete()} />
        </View>
      </View>
    );
  }

  handleBarCodeScanned = ({ data }) => {
    this.setState({ scanned: true, scannedData: data });
  };

  stamp = () => {
    fetch('http://192.168.43.92:8080/process/stamp', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: JSON.parse(this.state.scannedData).clientId,
        businessId: businessId
      })
    });
  }

  complete = () => {
    fetch('http://192.168.43.92:8080/process/complete', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: JSON.parse(this.state.scannedData).clientId,
        businessId: businessId
      })
    });
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  body: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    flexDirection: 'row'
  }
});
