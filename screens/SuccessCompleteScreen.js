import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class SuccessCompleteScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>DONE</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 32,
        color: "green",
        fontWeight: 'bold'
    }
});