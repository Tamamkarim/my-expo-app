import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Card, Text } from '@rneui/themed';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import MediaListItem from './MediaListItem';
import { useUpdateContext } from '../hooks/ContextHooks';
import { fetchData } from '../utils/fetch-data';
import Constants from 'expo-constants';
import type { MediaItem, MediaItemWithOwner } from '../types/DBTypes';

interface MediaItemWithTags extends MediaItemWithOwner {
  tags?: string[];
}

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const LIMIT = 10;

const MediaList = ({ navigation }: Props) => {
  const { update } = useUpdateContext();
  const [mediaArray, setMediaArray] = useState<MediaItemWithTags[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const mediaApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_MEDIA_API ?? '';
  const authApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_API ?? '';

  const fetchMediaPage = async (pageNum: number) => {
    setLoading(true);
    try {
      const media = await fetchData<MediaItem[]>(`${mediaApi}/media?page=${pageNum}&limit=${LIMIT}`);
      if (media.length < LIMIT) setHasMore(false);
      const mediaWithOwnersAndTags = await Promise.all<MediaItemWithTags>(
        media.map(async (item: MediaItem) => {
          try {
            const owner = await fetchData<{ username: string }>(`${authApi}/users/${item.user_id}`);
            // جلب الوسوم لهذا العنصر
            let tags: string[] = [];
            try {
              tags = await fetchData<string[]>(`${mediaApi}/media/${item.media_id}/tags`);
            } catch {
              tags = [];
            }
            return { ...item, username: owner.username, tags };
          } catch {
            return { ...item, username: 'not found', tags: [] };
          }
        })
      );
      setMediaArray((prev) => [...prev, ...mediaWithOwnersAndTags]);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMediaArray([]);
    setPage(1);
    setHasMore(true);
    fetchMediaPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMediaPage(nextPage);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 12, paddingTop: 12 }}>
      <Text h3 style={{ color: '#F9FAFB', marginBottom: 8 }}>Latest media</Text>
      <Card containerStyle={{ marginHorizontal: 0 }}>
        <FlatList
          data={mediaArray}
          keyExtractor={(item) => String(item.media_id ?? item.user_id)}
          renderItem={({ item }) => <MediaListItem navigation={navigation} item={item} />}
          ItemSeparatorComponent={() => <View />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        />
      </Card>
    </View>
  );
};

export default MediaList;
