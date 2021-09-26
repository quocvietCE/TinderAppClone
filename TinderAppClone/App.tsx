/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';

import Amplify, { Hub } from 'aws-amplify';
import config from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';

Amplify.configure({ ...config, Analytics: { enabled: false } });

const App = () => {
  const [activeScreen, setActiveScreen] = useState<
    'HomeScreen' | 'MatchesScreen' | 'ProfileScreen' | 'UserDetailsScreen'
  >('HomeScreen');

  useEffect(() => {
    // Create listener
    const listener = Hub.listen('datastore', async (hubData) => {
      const { event, data } = hubData.payload;
      if (event === 'modelSynced') {
        console.log(`User has a network connection: , ${JSON.stringify(data)}`);
        // console.log(`Model has finished syncing: ${model.name}`);
      }
    });
    return () => listener();
  }, []);

  const setActiveHomeScreen = useCallback(() => {
    setActiveScreen('HomeScreen');
  }, []);

  const setActiveMatchesScreen = useCallback(() => {
    setActiveScreen('MatchesScreen');
  }, []);

  const setActiveProfileScreen = useCallback(() => {
    setActiveScreen('ProfileScreen');
  }, []);

  const showScreen = useMemo(() => {
    switch (activeScreen) {
      case 'HomeScreen':
        return <HomeScreen />;
      case 'MatchesScreen':
        return <MatchesScreen />;
      case 'UserDetailsScreen':
        return <UserDetailsScreen />;
      default:
        return <ProfileScreen />;
    }
  }, [activeScreen]);

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
        <Pressable onPress={setActiveProfileScreen}>
          <FontAwesome
            name="user"
            size={30}
            color={activeScreen === 'ProfileScreen' ? activeColor : color}
          />
        </Pressable>
      </View>
      {/* {activeScreen === 'HomeScreen' ? <HomeScreen /> : <MatchesScreen />} */}
      {showScreen}
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

export default withAuthenticator(App);
