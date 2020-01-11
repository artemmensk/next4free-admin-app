import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class ErrorScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>ERROR</Text>
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
        color: "red",
        fontWeight: 'bold'
    }
});