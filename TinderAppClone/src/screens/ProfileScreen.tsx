import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Auth, DataStore } from 'aws-amplify';
import { User } from '../models';

export declare type GENDERS = 'MALE' | 'FEMALE' | 'OTHER';

interface UserMode {
  name: string;
  bio: string;
  gender: GENDERS;
  lookingFor: GENDERS;
  id?: string;
  sub?: string;
  image?: string;
}

const ProfileScreen: FunctionComponent = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('MALE');
  const [lookingFor, setLookingFor] = useState('FEMALE');
  const [user, setUser] = useState<UserMode>({
    name: '',
    bio: '',
    lookingFor: 'FEMALE',
    gender: 'MALE',
  });

  const isValid = useCallback(() => {
    return name && bio && gender && lookingFor;
  }, [name, bio, lookingFor, gender]);

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
      const dbUser = dbUsers[0];
      console.log('dbUser 0: ', dbUser);
      setUser(dbUser);
      setName(dbUser.name);
      setBio(dbUser.bio);
      setGender(dbUser.gender);
      setLookingFor(dbUser.lookingFor);
    };
    getCurrentUser();
  }, []);

  const onSignOut = useCallback(() => {
    Auth.signOut();
  }, []);

  const onSave = useCallback(async () => {
    try {
      if (!isValid()) {
        console.log('Not valid');
        return;
      }

      if (user) {
        const updateUser = User.copyOf(user, (updated) => {
          updated.name = name;
          updated.bio = bio;
          updated.gender = gender;
          updated.lookingFor = lookingFor;
        });

        await DataStore.save(updateUser);
      } else {
        const userAuth = await Auth.currentAuthenticatedUser();

        const newUser = new User({
          name,
          bio,
          gender,
          lookingFor,
          image:
            'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
          sub: userAuth.attributes.sub,
        });

        await DataStore.save(newUser);
      }
    } catch (error) {
      console.log('Error save posts', error);
    }
  }, [isValid, user, name, bio, gender, lookingFor]);

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.container}>
        <Text>ProfileScreen</Text>
        <TextInput
          style={styles.input}
          placeholder="Name..."
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio..."
          value={bio}
          multiline
          numberOfLines={3}
          onChangeText={setBio}
        />
        <Text>Gender</Text>
        <Picker
          label="Gender"
          selectedValue={gender}
          onValueChange={(itemValue) => {
            console.log('itemValue: ', itemValue);
            setGender(itemValue);
          }}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
        <Text>Looking For</Text>
        <Picker
          label="Looking for"
          selectedValue={lookingFor}
          onValueChange={(itemValue) => {
            console.log('itemValue: ', itemValue);
            setLookingFor(itemValue);
          }}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
        <Pressable onPress={onSave} style={styles.btnSave}>
          <Text>Save</Text>
        </Pressable>
        <Pressable
          onPress={onSignOut}
          style={[styles.btnSave, { backgroundColor: 'gray' }]}>
          <Text style={{ color: 'white' }}>Sign Out</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  input: {
    margin: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  btnSave: {
    backgroundColor: '#F63A6E',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
});
