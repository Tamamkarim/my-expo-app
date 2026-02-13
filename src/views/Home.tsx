import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {Card} from '@rneui/themed';
import type {NavigationProp, ParamListBase} from '@react-navigation/native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../hooks/apiHooks';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray} = useMedia();

  return (
    <Card>
      {mediaArray.length === 0 ? (
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
        />
      )}
    </Card>
  );
};

export default Home;
