import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import type {MediaItemWithOwner} from '../types/DBTypes';
import AsyncImage from '../components/AsyncImage';

export type RootStackParamList = {
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
};

type SingleRouteProp = RouteProp<RootStackParamList, 'Single'>;

const Single = () => {
  const route = useRoute<SingleRouteProp>();
  const {item} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {item.thumbnail ? (
        <AsyncImage source={{uri: item.thumbnail}} style={styles.image} />
      ) : null}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>By {item.username}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
});

export default Single;
