import React from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import type {NavigationProp, ParamListBase} from '@react-navigation/native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../hooks/apiHooks';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray} = useMedia();

  return (
    <SafeAreaView style={styles.container}>
      {mediaArray.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={mediaArray}
          keyExtractor={(item) => String(item.media_id ?? item.user_id)}
          renderItem={({item}) => (
            <MediaListItem navigation={navigation} item={item} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default Home;
