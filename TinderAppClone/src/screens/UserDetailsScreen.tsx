import React, { FunctionComponent, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { Auth } from 'aws-amplify';

const UserDetailsScreen: FunctionComponent = () => {
  const onSignOut = useCallback(() => {
    Auth.signOut();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text>UserDetailsScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
});
