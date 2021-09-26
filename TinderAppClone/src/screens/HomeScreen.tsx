import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { DataStore, Auth, Hub } from 'aws-amplify';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Card, { CardItemType } from '../components/TinderCard';
import usersMock from '../assets/data/users';
import { User, Match } from '../models';

import AnimatedStack from '../components/AnimatedStack';
import { UserMode } from './ProfileScreen';

const HomeScreen = () => {
  const [users, setUsers] = useState<Array<UserMode>>([]);
  const [currentUser, setCurrentUser] = useState<UserMode | null>(null);
  const [me, setMe] = useState<UserMode | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userAuth = await Auth.currentAuthenticatedUser();
      // console.log('userAuth: ', userAuth);
      // console.log('userAuth.attributes: ', userAuth.attributes);
      const dbUser = await DataStore.query(User, (u) =>
        u.sub('eq', userAuth.attributes.sub),
      );
      console.log('dbUser: ', dbUser);
      setMe(dbUser[0]);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchUsersData = await DataStore.query(User);
      console.log('fetchUsersData: ', fetchUsersData);
      // setUsers(await DataStore.query(User));
      // setUsers(fetchUsersData);
      if (fetchUsersData.length > 0) {
        const usersDataConver = fetchUsersData.map((itemUser) => {
          return {
            id: itemUser.id,
            name: itemUser.name,
            image: itemUser.image,
            bio: itemUser.bio,
            gender: itemUser.gender,
            lookingFor: itemUser.lookingFor,
          };
        });
        setUsers(usersDataConver);
        console.log('fetchUsersData: ', fetchUsersData);
      }
    };
    fetchUsers();
  }, []);

  const onSwipeLeft = (user: CardItemType) => {
    console.log('onSwipeLeft: ', user);
    if (!currentUser || !me) {
      return;
    }
    console.log('swipe left', user.name);
  };

  const onSwipeRight = async (user: CardItemType) => {
    console.log('onSwipeRight 0: ', user);
    console.log('onSwipeRight me: ', me);
    if (!user || !me) {
      return;
    }

    const myMatches = await DataStore.query(Match, (match) =>
      match.User1ID('eq', me.id).User2ID('eq', user.id),
    );

    console.log('myMatches 0: ', myMatches);

    if (myMatches.length > 0) {
      console.log('You already swiped right to this user');
      return;
    }

    const hisMatches = await DataStore.query(Match, (match) =>
      match.User1ID('eq', user.id).User2ID('eq', me.id),
    );

    console.log('hisMatches 0: ', hisMatches);

    if (hisMatches.length > 0) {
      console.log('Yay, this is a new match');
      const hisMatch = hisMatches[0];
      DataStore.save(
        Match.copyOf(hisMatch, (updated) => (updated.isMatch = true)),
      );
      return;
    }

    console.log('Sending her a match request!');
    const matchData = await DataStore.save(
      new Match({ User1ID: me.id, User2ID: user.id, isMatch: false }),
    );
    console.log('matchData: ', matchData);
    console.log('swipe right: ', user.name);
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
