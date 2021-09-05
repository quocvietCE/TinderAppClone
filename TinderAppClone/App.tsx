/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import TinderCard from './src/components/TinderCard';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <TinderCard
        name={'Viet Nguyen'}
        image={
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim1.JPG'
        }
        bio={'dwadwadaw'}
      />
    </SafeAreaView>
  );
};

export default App;
