import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Profile view</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Profile;
