import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NavigationProp, ParamListBase} from '@react-navigation/native';
import type {MediaItemWithOwner} from '../types/DBTypes';
import AsyncImage from './AsyncImage';

interface Props {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
}

const MediaListItem = ({item, navigation}: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Single', {item})}
    >
      <View style={styles.content}>
        {item.thumbnail ? (
          <AsyncImage source={{uri: item.thumbnail}} style={styles.image} />
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexShrink: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
});

export default MediaListItem;
