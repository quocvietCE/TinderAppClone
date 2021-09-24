import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { DataStore, Auth } from 'aws-amplify';
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
      const dbUsers = await DataStore.query(
        User,
        (u) => u.sub === userAuth.attributes.sub,
      );

      if (dbUsers.length < 0) {
        return;
      }
      setMe(dbUsers[0]);
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
    if (!currentUser || !me) {
      return;
    }
    console.warn('swipe left', user.name);
  };

  const onSwipeRight = async (user: CardItemType) => {
    console.warn('swipe right 0: ', user);
    if (!user || !me) {
      return;
    }
    const matchData = await DataStore.save(
      new Match({ User1ID: me.id, User2ID: user.id, isMatch: false }),
    );
    console.warn('matchData: ', matchData);
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
