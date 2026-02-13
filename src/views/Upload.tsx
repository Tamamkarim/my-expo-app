import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Image, ScrollView, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {Video} from 'expo-av';
import {Button, Input, Text} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useUserContext, useUpdateContext} from '../hooks/ContextHooks';

interface UploadInputs {
  title: string;
  description: string;
}

type RootStackParamList = {
  Tabs: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

const Upload = ({navigation}: Props) => {
  const [image, setImage] = useState<
    | {
        canceled: boolean;
        assets?: {uri: string; type?: string; mimeType?: string | null}[];
      }
    | null
  >(null);
  const [uploading, setUploading] = useState(false);
  const {token} = useUserContext();
  const {triggerUpdate} = useUpdateContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm<UploadInputs>({
    defaultValues: {title: '', description: ''},
    mode: 'onChange',
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const resetForm = useCallback(() => {
    reset();
    setImage(null);
  }, [reset]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation, resetForm]);

  const postExpoFile = async (
    imageUri: string,
    authToken: string,
  ): Promise<any | null> => {
    const fileResult = await FileSystem.uploadAsync(
      `${process.env.EXPO_PUBLIC_UPLOAD_API as string}/upload`,
      imageUri,
      {
        httpMethod: 'POST',
        // Cast to any to avoid type mismatch across SDK versions
        uploadType: (FileSystem as any).FileSystemUploadType?.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    return fileResult.body ? JSON.parse(fileResult.body) : null;
  };

  const doUpload = async (inputs: UploadInputs) => {
    try {
      if (!image || image.canceled || !image.assets?.[0]?.uri) {
        Alert.alert('Error', 'Please select an image or video first.');
        return;
      }
      if (!token) {
        Alert.alert('Error', 'You must be logged in to upload.');
        return;
      }
      setUploading(true);
      const uploadResponse = await postExpoFile(image.assets[0].uri, token);
      if (!uploadResponse) {
        Alert.alert('Error', 'File upload failed.');
        return;
      }
      // TODO: call postMedia with uploadResponse and inputs when available
      triggerUpdate();
      resetForm();
      navigation.navigate('Tabs');
      Alert.alert('Success', 'File uploaded successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const asset =
    !image || image.canceled || !image.assets || image.assets.length === 0
      ? undefined
      : image.assets[0];
  const selectedUri = asset?.uri;
  const isVideoAsset =
    asset?.type === 'video' || asset?.mimeType?.startsWith('video/');

  return (
    <ScrollView contentContainerStyle={{padding: 16}}>
      <Text h3 style={{marginBottom: 16}}>
        Upload Media
      </Text>

      <View style={{alignItems: 'center', marginBottom: 16}}>
        {selectedUri ? (
          isVideoAsset ? (
            <Video
              source={{uri: selectedUri}}
              style={{width: 200, height: 200, backgroundColor: '#000'}}
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{uri: selectedUri}}
              style={{width: 200, height: 200, backgroundColor: '#eee'}}
            />
          )
        ) : (
          <Image
            source={require('../../assets/favicon.png')}
            style={{width: 200, height: 200, backgroundColor: '#eee'}}
          />
        )}
        <Button
          title="Choose file"
          onPress={pickImage}
          containerStyle={{marginTop: 8}}
        />
      </View>

      <Controller
        control={control}
        name="title"
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label="Title"
            placeholder="Enter title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.title
                ? 'Title is required and must be at least 3 characters.'
                : undefined
            }
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label="Description"
            placeholder="Enter description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.description
                ? 'Description must be at least 3 characters.'
                : undefined
            }
          />
        )}
      />

      <Button
        title="Upload"
        onPress={handleSubmit(doUpload)}
        loading={uploading}
        disabled={!isValid || !selectedUri || uploading}
        containerStyle={{marginBottom: 8}}
      />

      <Button
        title="Reset"
        type="outline"
        onPress={resetForm}
      />
    </ScrollView>
  );
};

export default Upload;
