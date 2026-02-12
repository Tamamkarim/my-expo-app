import type {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from '../types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../utils/fetch-data';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData<MediaItem[]>(
          `${process.env.EXPO_PUBLIC_MEDIA_API as string}/media`,
        );
        const mediaWithOwners = await Promise.all<MediaItemWithOwner>(
          media.map(async (item: MediaItem) => {
            try {
              const owner = await fetchData<UserWithNoPassword>(
                `${process.env.EXPO_PUBLIC_AUTH_API as string}/users/${item.user_id}`,
              );
              const mediaItemWithOwner: MediaItemWithOwner = {
                ...item,
                username: owner.username,
              };
              return mediaItemWithOwner;
            } catch (error) {
              console.error(error);
              return {
                ...item,
                username: 'not found',
              };
            }
          }),
        );
        setMediaArray(mediaWithOwners);
        console.log(mediaWithOwners);
      } catch (error) {
        console.error(error);
      }
    };

    getMedia();
  }, []);
  return {mediaArray};
};

export {useMedia};