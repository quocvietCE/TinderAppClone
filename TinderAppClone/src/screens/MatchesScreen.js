import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import usersMock from '../assets/data/users';
import { DataStore, Auth } from 'aws-amplify';
import { Match, User } from '../models';
import { UserMode } from './ProfileScreen';

const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);

  const getCurrentUser = async () => {
    const userAuth = await Auth.currentAuthenticatedUser();

    const dbUser = await DataStore.query(User, (u) =>
      u.sub('eq', userAuth.attributes.sub),
    );

    console.log('dbUser: ', dbUser);
    setMe(dbUser[0]);
    // }
  };

  useEffect(() => getCurrentUser(), []);

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      const fetchMatchesData = await DataStore.query(Match, (m) =>
        m.isMatch('eq', true).User1ID('eq', me.id),
      );
      console.log('fetchMatchesData: ', fetchMatchesData);
      // setUsers(await DataStore.query(User));
      // setUsers(fetchUsersData);
      if (fetchMatchesData.length > 0) {
        setMatches(fetchMatchesData);
      }
    };
    fetchMatches();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#F63A6E' }}>
          New Matches
        </Text>
        <View style={styles.users}>
          {/* {usersMock.map((user) => (
            <View style={styles.user} key={user.id}>
              <Image source={{ uri: user.image }} style={styles.image} />
            </View>
          ))} */}
          {matches.map((user) => (
            <View style={styles.user} key={user.id}>
              <Image source={{ uri: user.image }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,

    borderWidth: 2,
    padding: 3,
    borderColor: '#F63A6E',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default MatchesScreen;
