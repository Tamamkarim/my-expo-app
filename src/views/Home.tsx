import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {Card} from '@rneui/themed';
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
    <Card>
      {loading && mediaArray.length === 0 ? (
        <View>
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
  );
};

export default Home;
