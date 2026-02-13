import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text} from '@rneui/themed';
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
    <Card containerStyle={styles.container}>
      {item.thumbnail ? (
        <AsyncImage source={{uri: item.thumbnail}} style={styles.image} />
      ) : null}
      <View style={styles.textContainer}>
        <Card.Title>{item.title}</Card.Title>
        <Card.Divider />
        <Text style={styles.author}>By {item.username}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
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
