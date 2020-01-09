import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const backendUrl = 'http://192.168.43.92:8080'
const businessId = 'hardcoded business id'

export class ClientStateScreen extends React.Component {
  state = {
    currentProcessLoaded: false,
  }

  async componentDidMount() {
    this.setState({
      clientId: this.props.navigation.state.params.clientId
    }, () => this.fetchCurrentProcess(this.state.clientId))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text>header</Text>
        </View>
        <View style={styles.body}>
          {this.state.currentProcessLoaded && <Text>Current process: {this.currentAmmountOfStamps()} / {this.targetAmmountOfStamps()}</Text>}
        </View>
        <View style={styles.footer}>
          <Button title={'Stamp'} onPress={() => this.stamp()} />
          <Button title={'Complete'} onPress={() => this.complete()} />
        </View>
      </View>
    );
  }

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