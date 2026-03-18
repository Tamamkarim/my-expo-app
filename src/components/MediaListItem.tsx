import React from 'react';
import {ListItem, Avatar} from '@rneui/themed';
import type {NavigationProp, ParamListBase} from '@react-navigation/native';
import type {MediaItemWithOwner} from '../types/DBTypes';

interface Props {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
}

const MediaListItem = ({item, navigation}: Props) => {
  return (
    <ListItem onPress={() => navigation.navigate('Single', {item})}>
      {item.thumbnail ? (
        <Avatar
          rounded
          source={{uri: item.thumbnail}}
        />
      ) : null}
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
        {/* عرض الوسوم إذا كانت متوفرة */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <ListItem.Subtitle>
            الوسوم: {item.tags.join(', ')}
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

export default MediaListItem;
