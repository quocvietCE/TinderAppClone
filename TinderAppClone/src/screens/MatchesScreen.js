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
    if (dbUser.length < 0) {
      return;
    }
    console.log('dbUser: ', dbUser);
    setMe(dbUser[0]);
  };

  useEffect(() => getCurrentUser(), []);

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      const fetchMatchesData = await DataStore.query(Match, (m) =>
        // m.isMatch('eq', true).User1ID('eq', me.id),
        m
          .isMatch('eq', true)
          .or((m1) => m1.User1ID('eq', me.id).User2ID('eq', me.id)),
      );
      console.log('fetchMatchesData: ', fetchMatchesData);
      console.log('fetchMatchesData.length: ', fetchMatchesData.length);
      // setUsers(await DataStore.query(User));
      // setUsers(fetchUsersData);
      if (fetchMatchesData.length > 0) {
        setMatches(fetchMatchesData);
      }
    };
    fetchMatches();
  }, [me]);

  useEffect(() => {
    const subcription = DataStore.observe(Match).subscribe((msg) => {
      console.log(
        'msg.model: ',
        msg.model,
        '\nmsg.opType: ',
        msg.opType,
        '\nmsg.element: ',
        msg.element,
      );
      if (msg.opType === 'UPDATE') {
        const newMatch = msg.element;
        if (
          newMatch.isMatch &&
          (newMatch.User1ID === me.id || newMatch.User2ID === me.id)
        ) {
          console.log('++++++++ There is a new match waiting for you!');
        }
      }
    });
    return () => subcription.unsubscribe();
  }, [me]);

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
          {matches.map((match) => {
            const matchUser =
              match.User1ID === me.id ? match.User2 : match.User1;
            if (!match.User1 || !match.User2) {
              return (
                <View style={styles.user} key={match.id}>
                  <Image source={{}} style={styles.image} />
                  <Text style={styles.name}>New match for you</Text>
                </View>
              );
            }
            return (
              <View style={styles.user} key={match.id}>
                <Image source={{ uri: matchUser.image }} style={styles.image} />
                <Text style={styles.name}>{matchUser.name}</Text>
              </View>
            );
          })}
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
  name: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default MatchesScreen;
