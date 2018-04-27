import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainMenu from './src/components/MainMenu.jsx';
import { API_KEY } from 'react-native-dotenv';

console.log(`using API_KEY ${API_KEY}`);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MainMenu apiKey={API_KEY} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
