import type {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from '../types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../utils/fetch-data';
import {useUpdateContext} from './ContextHooks';

interface MediaUpdatePayload {
  title: string;
  description?: string;
}

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {update} = useUpdateContext();

  useEffect(() => {
    const getMedia = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    getMedia();
  }, [update]);

  const putMedia = async (
    mediaId: number,
    data: MediaUpdatePayload,
    token: string,
  ): Promise<MediaItem | null> => {
    try {
      const updated = await fetchData<MediaItem>(
        `${process.env.EXPO_PUBLIC_MEDIA_API as string}/media/${mediaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      return updated;
    } catch (error) {
      console.error('Updating media failed', error);
      return null;
    }
  };

  const deleteMedia = async (
    mediaId: number,
    token: string,
  ): Promise<boolean> => {
    try {
      await fetchData<unknown>(
        `${process.env.EXPO_PUBLIC_MEDIA_API as string}/media/${mediaId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return true;
    } catch (error) {
      console.error('Deleting media failed', error);
      return false;
    }
  };

  return {mediaArray, loading, putMedia, deleteMedia};
};

export {useMedia};