export interface MediaItem {
  media_id?: number;
  user_id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  filename?: string;
  filesize?: number;
  time_added?: string;
  media_type?: string;
}

export interface UserWithNoPassword {
  username: string;
}

export interface MediaItemWithOwner extends MediaItem {
  username: string;
}

// Authenticated user type returned from auth API
export interface AuthUser {
  user_id: number;
  username: string;
  email?: string;
}
