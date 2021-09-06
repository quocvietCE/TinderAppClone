import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Card, { CardItemType } from '../components/TinderCard';
import users from '../assets/data/users';

import AnimatedStack from '../components/AnimatedStack';

const HomeScreen = () => {
  const onSwipeLeft = (user: CardItemType) => {
    console.warn('swipe left', user.name);
  };

  const onSwipeRight = (user: CardItemType) => {
    console.warn('swipe right: ', user.name);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({ item }) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.bottomNavigation}>
        <Pressable style={styles.button}>
          <FontAwesome name="undo" size={30} color="#FBD88B" />
        </Pressable>
        <Pressable style={styles.button}>
          <Entypo name="cross" size={30} color="#F76C6B" />
        </Pressable>
        <Pressable style={styles.button}>
          <FontAwesome name="star" size={30} color="#3AB4CC" />
        </Pressable>
        <Pressable style={styles.button}>
          <FontAwesome name="heart" size={30} color="#4FCC94" />
        </Pressable>
        <Pressable style={styles.button}>
          <Ionicons name="flash" size={30} color="#A65CD2" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
  },

  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
