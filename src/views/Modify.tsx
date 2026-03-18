import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView} from 'react-native';
import {Button, Input, Text} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import {useUserContext, useUpdateContext} from '../hooks/ContextHooks';
import {useMedia} from '../hooks/apiHooks';

interface ModifyInputs {
  title: string;
  description: string;
}

const Modify = ({navigation, route}: any) => {
  const {item} = route.params;
  const {token} = useUserContext();
  const {triggerUpdate} = useUpdateContext();
  const {putMedia} = useMedia();
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm<ModifyInputs>({
    defaultValues: {
      title: item.title,
      description: item.description ?? '',
    },
    mode: 'onChange',
  });

  const resetForm = useCallback(() => {
    reset({title: item.title, description: item.description ?? ''});
  }, [item.description, item.title, reset]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation, resetForm]);

  const doModify = async (inputs: ModifyInputs) => {
    if (!token || !item.media_id) {
      Alert.alert('Error', 'Missing token or media id.');
      return;
    }
    try {
      setSaving(true);
      const success = await putMedia(item.media_id, inputs, token);
      if (!success) {
        Alert.alert('Error', 'Updating media failed.');
        return;
      }
      triggerUpdate();
      Alert.alert('Success', 'Media updated.');
      navigation.navigate('Tabs');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Updating media failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#0F172A'}}
      contentContainerStyle={{padding: 16}}
    >
      <Text h3 style={{marginBottom: 16, color: '#F9FAFB'}}>
        Modify Media
      </Text>

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
        title="Save"
        onPress={handleSubmit(doModify)}
        loading={saving}
        disabled={!isValid || saving}
        containerStyle={{marginBottom: 8}}
      />

      <Button title="Reset" type="outline" onPress={resetForm} />
    </ScrollView>
  );
};

export default Modify;
