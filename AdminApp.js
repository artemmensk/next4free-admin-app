import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { registerRootComponent } from 'expo';

import { BarCodeScanner } from 'expo-barcode-scanner';

const backendUrl = 'http://192.168.43.92:8080'
const businessId = 'hardcoded business id'

class AdminApp extends React.Component {
  state = {
    currentProcessLoaded: false,
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
                <Text>Current clientId:</Text>
                <Text>{this.state.clientId}</Text>
              </View>
            )}
        </View>
        {this.state.currentProcessLoaded && <Text>Current process: {this.currentAmmountOfStamps()} / {this.targetAmmountOfStamps()}</Text>}
        <View style={styles.footer}>
          <Button title={'Scan'} onPress={() => this.setState({ scanned: false })} />
          <Button title={'Stamp'} onPress={() => this.stamp()} />
          <Button title={'Complete'} onPress={() => this.complete()} />
        </View>
      </View>
    );
  }

  handleBarCodeScanned = ({ data }) => {
    var clientId = JSON.parse(data).clientId
    this.setState({ scanned: true, clientId: clientId });
    this.fetchCurrentProcess(clientId)
  };

  async stamp() {
    await fetch(backendUrl + '/process/stamp', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: this.state.clientId,
        businessId: businessId
      })
    });
    this.fetchCurrentProcess(this.state.clientId)
  }

  async complete() {
    await fetch(backendUrl + '/process/complete', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: this.state.clientId,
        businessId: businessId
      })
    });
    this.fetchCurrentProcess(this.state.clientId)
  }

  currentAmmountOfStamps() {
    return this.state.currentProcessLoaded ? this.state.currentProcess.stamps.length : ''
  }

  targetAmmountOfStamps() {
    return this.state.currentProcessLoaded ? this.state.currentProcess.processPolicy.targetAmount : ''
  }

  async fetchCurrentProcess(clientId) {
    this.setState({
      currentProcessLoaded: false
    })

    var response = await fetch(backendUrl + '/client/' + clientId + '/business/' + businessId + '/current-process', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });

    if (response.status !== 200) {
      return;
    }

    var currentProcess = await response.json();

    this.setState({
      currentProcessLoaded: true,
      currentProcess: currentProcess
    })
  };
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

export default registerRootComponent(AdminApp);