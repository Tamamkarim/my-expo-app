import React from 'react';
import {Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@rneui/themed';
import type {RegisterInputs} from '../contexts/UserContext';
import {
  checkEmailAvailable,
  checkUsernameAvailable,
  postUser,
} from '../lib/functions';

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm<RegisterInputs>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const doRegister = async (inputs: RegisterInputs) => {
    const success = await postUser(inputs);
    if (success) {
      Alert.alert('Success', 'Account created. You can now log in.');
    } else {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <Card>
      <Card.Title>Register</Card.Title>
      <Card.Divider />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: async (value) => {
            const available = await checkUsernameAvailable(value);
            return available || 'username is already taken';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'not a valid email',
          },
          validate: async (value) => {
            const available = await checkEmailAvailable(value);
            return available || 'email is already in use';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          minLength: {value: 8, message: 'min length is 8'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: (value) =>
            value === getValues('password') || 'Passwords do not match',
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Confirm password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message}
          />
        )}
        name="confirmPassword"
      />

      <Button title="Register" onPress={handleSubmit(doRegister)} />
      {Object.values(errors).length > 0 && (
        <Text style={{marginTop: 8}}>Please fix the errors above.</Text>
      )}
    </Card>
  );
};

export default RegisterForm;
