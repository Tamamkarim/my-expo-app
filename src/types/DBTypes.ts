export interface MediaItem {
  media_id?: number;
  user_id: number;
  title: string;
  thumbnail?: string;
}

export interface UserWithNoPassword {
  username: string;
}

export interface MediaItemWithOwner extends MediaItem {
  username: string;
}
