declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_AUTH_API?: string;
    EXPO_PUBLIC_MEDIA_API?: string;
    EXPO_PUBLIC_UPLOAD_API?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
