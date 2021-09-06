/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';

declare type ActiveScreen = 'HomeScreen' | 'MatchesScreen';

const App = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('HomeScreen');

  const setActiveHomeScreen = useCallback(() => {
    setActiveScreen('HomeScreen');
  }, []);

  const setActiveMatchesScreen = useCallback(() => {
    setActiveScreen('MatchesScreen');
  }, []);

  const color = '#b5b5b5';
  const activeColor = '#F76C6B';
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topNavigation}>
        <Pressable onPress={setActiveHomeScreen}>
          <Fontisto
            name="tinder"
            size={30}
            color={activeScreen === 'HomeScreen' ? activeColor : color}
          />
        </Pressable>

        <MaterialCommunityIcons
          name="star-four-points"
          size={30}
          color={color}
        />
        <Pressable onPress={setActiveMatchesScreen}>
          <Ionicons
            name="ios-chatbubbles"
            size={30}
            color={activeScreen === 'MatchesScreen' ? activeColor : color}
          />
        </Pressable>

        <FontAwesome name="user" size={30} color={color} />
      </View>
      {activeScreen === 'HomeScreen' ? <HomeScreen /> : <MatchesScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
});

export default App;
