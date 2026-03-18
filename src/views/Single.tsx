import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Card, Text} from '@rneui/themed';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Video} from 'expo-video';
import type {AuthUser, MediaItemWithOwner} from '../types/DBTypes';
import AsyncImage from '../components/AsyncImage';
import {useUserContext, useUpdateContext} from '../hooks/ContextHooks';
import {useMedia} from '../hooks/apiHooks';

export type RootStackParamList = {
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
};

type SingleRouteProp = RouteProp<RootStackParamList, 'Single'>;

const Single = () => {
  const route = useRoute<SingleRouteProp>();
  const {item} = route.params;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {user, token} = useUserContext();
  const {triggerUpdate} = useUpdateContext();
  const {deleteMedia} = useMedia();

  const assetType = item.media_type ?? '';
  const isVideo = assetType.startsWith('video');
  const mediaUri = item.thumbnail;

  const isOwner = (user as AuthUser | null)?.user_id === item.user_id;

  const handleDelete = () => {
    if (!token || !item.media_id) {
      Alert.alert('Error', 'Missing token or media id.');
      return;
    }
    Alert.alert('Delete', 'Are you sure you want to delete this media?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const ok = await deleteMedia(item.media_id as number, token);
          if (ok) {
            triggerUpdate();
            navigation.navigate('Tabs' as never);
          } else {
            Alert.alert('Error', 'Deleting media failed.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Card containerStyle={styles.card}>
      {mediaUri ? (
        isVideo ? (
          <Video
            source={{uri: mediaUri}}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <AsyncImage source={{uri: mediaUri}} style={styles.media} />
        )
      ) : null}
      <View style={styles.textContainer}>
        <Card.Title>{item.title}</Card.Title>
        <Card.Divider />
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <Text style={styles.author}>By {item.username}</Text>
        {item.time_added ? (
          <Text style={styles.meta}>Added: {item.time_added}</Text>
        ) : null}
        {typeof item.filesize === 'number' ? (
          <Text style={styles.meta}>Size: {item.filesize} bytes</Text>
        ) : null}
        {isOwner ? (
          <View style={styles.actions}>
            <Button
              title="Modify"
              onPress={() => navigation.navigate('Modify' as never, {item} as never)}
              containerStyle={{marginRight: 8}}
            />
            <Button
              title="Delete"
              color="error"
              onPress={handleDelete}
            />
          </View>
        ) : null}
      </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    paddingVertical: 16,
  },
  media: {
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
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});

export default Single;
