import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {Card, Text} from '@rneui/themed';
import type {NavigationProp, ParamListBase} from '@react-navigation/native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/ContextHooks';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray, loading} = useMedia();
  const {triggerUpdate} = useUpdateContext();

  const onRefresh = () => {
    triggerUpdate();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 12,
        paddingTop: 12,
      }}
    >
      <Text h3 style={{color: '#F9FAFB', marginBottom: 8}}>
        Latest media
      </Text>
      <Card containerStyle={{marginHorizontal: 0}}>
        {loading && mediaArray.length === 0 ? (
          <View style={{paddingVertical: 24}}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={mediaArray}
            keyExtractor={(item) => String(item.media_id ?? item.user_id)}
            renderItem={({item}) => (
              <MediaListItem navigation={navigation} item={item} />
            )}
            ItemSeparatorComponent={() => <View />}
            onRefresh={onRefresh}
            refreshing={loading}
          />
        )}
      </Card>
    </View>
  );
};

export default Home;
