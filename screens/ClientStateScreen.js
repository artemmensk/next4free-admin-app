import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const backendUrl = 'http://192.168.43.92:8080'
const businessId = 'hardcoded business id'
const defaultTargetAmmount = 3;

export class ClientStateScreen extends React.Component {
  state = {
    currentProcessFetched: false
  }

  async componentDidMount() {
    this.setState({
      clientId: this.props.navigation.state.params.clientId
    }, () => this.focusListener = this.props.navigation.addListener('didFocus', () => { this.fetchCurrentProcess(this.state.clientId) }))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <Text style={styles.text}>{this.currentAmmountOfStamps()} / {this.targetAmmountOfStamps()}</Text>
        </View>
        <View style={styles.buttonsView}>
          <View style={styles.buttonView}>
            <Button title={'Stamp'} color='black' onPress={() => this.stamp()} />
          </View>
          <View style={styles.buttonView}>
            {this.completeIsPossible()
              ? <Button title={'Complete'} color='black' onPress={() => this.complete()} />
              : <Button title={'Complete'} color='black' disabled />}
          </View>
        </View>
      </View >
    );
  }

  async stamp() {
    var response = await fetch(backendUrl + '/process/stamp', this.request());
    if (response.status === 200) {
      this.props.navigation.navigate('SuccessStampScreen');
      return;
    }
    this.props.navigation.navigate('ErrorScreen');
  }

  async complete() {
    var response = await fetch(backendUrl + '/process/complete', this.request());
    if (response.status === 200) {
      this.props.navigation.navigate('SuccessCompleteScreen');
      return;
    }
    this.props.navigation.navigate('ErrorScreen');
  }

  request() {
    var request = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: this.state.clientId,
        businessId: businessId
      })
    };

    return request;
  }

  completeIsPossible() {
    return this.state.currentProcessFetched ? this.currentAmmountOfStamps() >= this.targetAmmountOfStamps() : false
  }

  currentAmmountOfStamps() {
    return this.state.currentProcessFetched ? this.state.currentProcess.stamps.length : 0
  }

  targetAmmountOfStamps() {
    return this.state.currentProcessFetched ? this.state.currentProcess.processPolicy.targetAmount : defaultTargetAmmount
  }

  async fetchCurrentProcess(clientId) {

    var response = await fetch(backendUrl + '/client/' + clientId + '/business/' + businessId + '/current-process', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });

    if (response.status !== 200) {
      this.setState({
        currentProcessFetched: false,
      })
      return;
    }

    var currentProcess = await response.json();

    this.setState({
      currentProcessFetched: true,
      currentProcess: currentProcess
    })
  };
}

const styles = StyleSheet.create({
  body: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 64,
    fontWeight: 'bold'
  },
  buttonsView: {
    flex: 1,
    alignItems: 'center'
  },
  buttonView: {
    flex: 1,
    width: "80%",
    margin: 10
  }
});